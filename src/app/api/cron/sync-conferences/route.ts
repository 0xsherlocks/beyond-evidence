import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { prisma } from '@/src/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type ListedConference = { acronym: string; fullName: string; cfpLink: string };
type ImportantDate = { label: string; date: string };
type TopicSection = { sectionTitle: string; items: string[] };
type CommitteeMember = { role: string; name: string; affiliation?: string };

const EASYCHAIR_ROOT = 'https://easychair.org';
const DETAIL_LIMIT = Math.max(1, Number(process.env.EASYCHAIR_SYNC_DETAILS_LIMIT || 25));
const REQUEST_TIMEOUT = 8000;
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT);
  return fetch(url, { ...init, signal });
}

function dateFromText(value: string): Date | null {
  const match = value.match(/\b(\d{1,2}[\/.\\-]\d{1,2}[\/.\\-]\d{2,4}|\d{4}[\/.\\-]\d{1,2}[\/.\\-]\d{1,2}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?),?\s+\d{4})\b/i);
  if (!match) return null;
  const parsed = new Date(match[1]);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Extract a date range like "March 15–17, 2026" or "15–17 March 2026" → [start, end] */
function dateRangeFromText(text: string): [Date, Date] | [Date, null] | null {
  // Pattern: "Month D1-D2, YYYY" or "Month D1 - Month D2, YYYY"
  const rangeMatch = text.match(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})\s*[-–—]\s*(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+)?(\d{1,2}),?\s+(\d{4})/i
  );
  if (rangeMatch) {
    const [, startMonth, startDay, endMonth, endDay, year] = rangeMatch;
    const start = new Date(`${startMonth} ${startDay}, ${year}`);
    const end = new Date(`${endMonth || startMonth} ${endDay}, ${year}`);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) return [start, end];
  }
  // Single date fallback
  const single = dateFromText(text);
  return single ? [single, null] : null;
}

function textUntilNextHeading($: cheerio.CheerioAPI, heading: cheerio.Cheerio<any>) {
  const parts: string[] = [];
  let current = heading.next();
  while (current.length && !/^h[1-6]$/i.test(current[0].tagName || '')) {
    const text = normalize(current.text());
    if (text) parts.push(text);
    current = current.next();
  }
  return normalize(parts.join('\n'));
}

function section($: cheerio.CheerioAPI, matcher: RegExp) {
  const heading = $('h1,h2,h3,h4,strong,b').filter((_, el) => matcher.test(normalize($(el).text()))).first();
  return heading.length ? { heading, text: textUntilNextHeading($, heading) } : null;
}

function parseDetail(html: string) {
  const $ = cheerio.load(html);
  const findSection = (name: RegExp) => section($, name);
  const important = findSection(/important dates?/i);
  const topics = findSection(/(?:list of )?topics?/i);
  const committees = findSection(/committees?/i);
  const contact = findSection(/contact/i);

  // ── Important Dates ────────────────────────────────────────────────────────
  const importantDates: ImportantDate[] = [];
  if (important) {
    // Handle both <table> rows and <li>/<p> elements
    const container = important.heading.nextUntil('h1,h2,h3,h4');
    container.find('tr').each((_, el) => {
      const cells = $(el).find('td,th').toArray();
      if (cells.length >= 2) {
        const label = normalize($(cells[0]).text());
        const rawDate = normalize($(cells[cells.length - 1]).text());
        const date = dateFromText(rawDate);
        if (label && date) importantDates.push({ label, date: date.toISOString().slice(0, 10) });
      }
    });
    // If table parsing found nothing, fall back to li/p
    if (!importantDates.length) {
      container.find('li,p').each((_, el) => {
        const raw = normalize($(el).text());
        const date = dateFromText(raw);
        if (date) {
          const label = normalize(raw.replace(/[:\-–—]?\s*(?:\d{1,2}[\/.\\-]\d{1,2}[\/.\\-]\d{2,4}|\d{4}[\/.\\-]\d{1,2}[\/.\\-]\d{1,2}|(?:Jan\w*|Feb\w*|Mar\w*|Apr\w*|May|Jun\w*|Jul\w*|Aug\w*|Sep\w*|Oct\w*|Nov\w*|Dec\w*)\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+(?:Jan\w*|Feb\w*|Mar\w*|Apr\w*|May|Jun\w*|Jul\w*|Aug\w*|Sep\w*|Oct\w*|Nov\w*|Dec\w*),?\s+\d{4})/i, ''));
          importantDates.push({ label, date: date.toISOString().slice(0, 10) });
        }
      });
    }
  }

  // ── Derive typed date fields from importantDates ───────────────────────────
  const findDate = (...patterns: RegExp[]): Date | null => {
    const entry = importantDates.find(d => patterns.some(p => p.test(d.label)));
    return entry ? new Date(entry.date) : null;
  };
  const submissionDeadline = findDate(
    /(?:paper|manuscript|full.?paper|regular.?paper)\s*(?:submission|deadline)/i,
    /submission\s*deadline/i,
    /(?:abstract|paper)\s*due/i,
  );
  const notificationDate = findDate(
    /notification\s*(?:of\s*acceptance|of\s*decision|to\s*authors)?/i,
    /author\s*notification/i,
    /acceptance\s*notification/i,
  );
  const cameraReadyDate = findDate(
    /camera[- ]?ready/i,
    /final\s*(?:version|manuscript|paper)/i,
    /final\s*submission/i,
  );

  // ── Topics ────────────────────────────────────────────────────────────────
  const topicSections: TopicSection[] = [];
  if (topics) {
    let currentTitle = 'Topics';
    let items: string[] = [];
    const flush = () => { if (items.length) topicSections.push({ sectionTitle: currentTitle, items }); };
    topics.heading.nextUntil('h1,h2,h3,h4').each((_, el) => {
      const tag = el.tagName?.toLowerCase();
      if (/^h[1-6]$/.test(tag || '') || tag === 'strong' || tag === 'b') { flush(); currentTitle = normalize($(el).text()); items = []; }
      $(el).find('li').each((_, li) => { const item = normalize($(li).text()); if (item) items.push(item); });
    });
    flush();
  }

  // ── Committees ────────────────────────────────────────────────────────────
  const committeeMembers: CommitteeMember[] = [];
  if (committees) {
    let role = 'Committee';
    committees.heading.nextUntil('h1,h2,h3,h4').each((_, el) => {
      const tag = el.tagName?.toLowerCase();
      if (/^h[1-6]$/.test(tag || '') || tag === 'strong' || tag === 'b') role = normalize($(el).text()) || role;
      $(el).find('li,tr').each((_, member) => {
        const raw = normalize($(member).text());
        if (!raw) return;
        const [name, ...affiliation] = raw.split(/\s*[—–-]\s*|,\s*/);
        if (name) committeeMembers.push({ role, name, affiliation: affiliation.join(', ') || undefined });
      });
    });
  }

  // ── Location extraction ────────────────────────────────────────────────────
  // Try EasyChair-specific selectors, then generic heuristics
  let location: string | null = null;
  const locationCandidates: string[] = [];

  // 1. Table cells labeled "Location" or "Venue" or "Place"
  $('td, th').each((_, el) => {
    const text = normalize($(el).text());
    if (/^(location|venue|place|city|held\s+at)$/i.test(text)) {
      const next = $(el).next('td,th');
      if (next.length) locationCandidates.push(normalize(next.text()));
    }
  });

  // 2. Elements with class/id containing "location" or "venue"
  $('[class*="location"],[id*="location"],[class*="venue"],[id*="venue"]').each((_, el) => {
    const text = normalize($(el).text());
    if (text && text.length < 120) locationCandidates.push(text);
  });

  // 3. Paragraph near the top that looks like "City, Country" or "City, State, Country"
  $('p, div').slice(0, 30).each((_, el) => {
    const text = normalize($(el).text());
    // Must have a comma, not too long, not a sentence
    if (/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Za-z]+/.test(text) && text.length < 80 && !/\.\s/.test(text)) {
      locationCandidates.push(text);
    }
  });

  location = locationCandidates.find(c => c.length > 3) ?? null;

  // ── Conference start/end dates ─────────────────────────────────────────────
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  // Look for date range in importantDates first
  const confDateEntry = importantDates.find(d =>
    /conference|event|workshop|symposium|dates?/i.test(d.label) && !/submission|notification|camera/i.test(d.label)
  );
  if (confDateEntry) {
    startDate = new Date(confDateEntry.date);
  }

  // Try to find date range in the page text (header area, venue section)
  if (!startDate) {
    const headerText = normalize($('h1,h2,.cfp-header,header,[class*="header"],[class*="title"]').first().parent().text().slice(0, 500));
    const range = dateRangeFromText(headerText);
    if (range) { startDate = range[0]; endDate = range[1]; }
  }

  // ── Links ─────────────────────────────────────────────────────────────────
  const links = $('a').toArray();
  const linkWithText = (expression: RegExp) => links.find(link => expression.test(normalize($(link).text())));
  const website = linkWithText(/conference (web ?page|website|site)|official (web ?site|website)/i);
  const submission = linkWithText(/submission (link|system)|submit (paper|manuscript)|easychair submission/i);
  const email = (contact?.text || $.text()).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];

  return {
    description: findSection(/^about\b/i)?.text || null,
    submissionGuidelines: findSection(/submission guidelines?/i)?.text || null,
    importantDates,
    topicSections,
    committees: committeeMembers,
    publication: findSection(/publication/i)?.text || null,
    venue: findSection(/venue/i)?.text || null,
    contactEmail: email || null,
    conferenceWebPage: website ? new URL($(website).attr('href') || '', EASYCHAIR_ROOT).toString() : null,
    submissionLink: submission ? new URL($(submission).attr('href') || '', EASYCHAIR_ROOT).toString() : null,
    // Typed fields derived from parsed content
    location,
    startDate,
    endDate,
    submissionDeadline,
    notificationDate,
    cameraReadyDate,
  };
}

function itemFromLink(link: string, name: string): ListedConference | null {
  const match = link.match(/\/cfp\/([^/?#]+)/i);
  if (!match || match[1].toLowerCase() === 'cfp') return null;
  const acronym = decodeURIComponent(match[1]).trim();
  return acronym ? { acronym, fullName: normalize(name) || acronym, cfpLink: new URL(link, EASYCHAIR_ROOT).toString() } : null;
}

async function getListedConferences() {
  const rssUrls = (process.env.CONFERENCE_RSS_URL || '').split(',').map(url => url.trim()).filter(Boolean);
  const conferences = new Map<string, ListedConference>();
  if (rssUrls.length) {
    const parser = new Parser();
    for (const url of rssUrls) {
      const feed = await parser.parseURL(url);
      for (const item of feed.items) {
        const conference = itemFromLink(item.link || '', item.title || '');
        if (conference) conferences.set(conference.acronym, conference);
      }
    }
  } else {
    const sourceUrl = process.env.EASYCHAIR_CFP_SOURCE_URL || `${EASYCHAIR_ROOT}/cfp/`;
    const response = await fetchWithTimeout(sourceUrl, { cache: 'no-store', headers: { 'User-Agent': 'BeyondEvidence conference sync/1.0' } });
    if (!response.ok) throw new Error(`EasyChair list request failed (${response.status})`);
    const $ = cheerio.load(await response.text());
    $('a[href*="/cfp/"]').each((_, link) => {
      const conference = itemFromLink($(link).attr('href') || '', $(link).text());
      if (conference) conferences.set(conference.acronym, conference);
    });
  }
  return [...conferences.values()];
}

async function syncConferences() {
  const allListed = await getListedConferences();
  if (!allListed.length) return { listed: 0, synced: 0, detailsUpdated: 0, limit: DETAIL_LIMIT, offset: 0, nextOffset: 0 };
  const state = await prisma.easyChairSyncState.upsert({
    where: { id: 'easychair-conferences' },
    create: { id: 'easychair-conferences', offset: 0 },
    update: {},
  });
  const offset = state.offset >= allListed.length ? 0 : state.offset;
  const listed = allListed.slice(offset, offset + DETAIL_LIMIT);
  let detailsUpdated = 0;

  await Promise.all(listed.map(async (conference) => {
    const externalId = `easychair:${conference.acronym.toLowerCase()}`;
    await prisma.notification.upsert({
      where: { externalId },
      create: { externalId, type: 'conference', title: conference.fullName, fullName: conference.fullName, acronym: conference.acronym, cfpLink: conference.cfpLink, link: conference.cfpLink, source: 'easychair', topics: [] },
      update: { title: conference.fullName, fullName: conference.fullName, cfpLink: conference.cfpLink, link: conference.cfpLink },
    });
    try {
      const response = await fetchWithTimeout(conference.cfpLink, {
        cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BeyondEvidenceBot/1.0; +https://beyondevidence.in)' },
      });
      if (!response.ok) throw new Error(`Detail request failed (${response.status})`);
      const detail = parseDetail(await response.text());

      await prisma.notification.update({
        where: { externalId },
        data: {
          description: detail.description,
          submissionGuidelines: detail.submissionGuidelines,
          importantDates: detail.importantDates,
          topicSections: detail.topicSections,
          committees: detail.committees,
          publication: detail.publication,
          venue: detail.venue,
          contactEmail: detail.contactEmail,
          conferenceWebPage: detail.conferenceWebPage,
          submissionLink: detail.submissionLink,
          topics: detail.topicSections.flatMap(t => t.items),
          // ── Typed fields now correctly populated ──────────────────────────
          location: detail.location ?? undefined,
          startDate: detail.startDate ?? undefined,
          endDate: detail.endDate ?? undefined,
          submissionDeadline: detail.submissionDeadline ?? undefined,
          notificationDate: detail.notificationDate ?? undefined,
          cameraReadyDate: detail.cameraReadyDate ?? undefined,
          lastDetailFetch: new Date(),
        },
      });
      detailsUpdated++;
    } catch (error) { console.warn(`Could not update ${conference.acronym}`, error); }
  }));

  const nextOffset = offset + listed.length >= allListed.length ? 0 : offset + listed.length;
  await prisma.easyChairSyncState.update({ where: { id: 'easychair-conferences' }, data: { offset: nextOffset } });
  return { listed: allListed.length, synced: listed.length, detailsUpdated, limit: DETAIL_LIMIT, offset, nextOffset };
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json(await syncConferences());
  } catch (error) {
    console.error('Conference sync failed', error);
    return NextResponse.json({ error: 'Conference sync failed' }, { status: 500 });
  }
}
