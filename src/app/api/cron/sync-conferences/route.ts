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

function dateFromText(value: string) {
  const match = value.match(/\b(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}|\d{4}[\/.\-]\d{1,2}[\/.\-]\d{1,2}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4})\b/i);
  if (!match) return null;
  const parsed = new Date(match[1]);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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

  const importantDates: ImportantDate[] = [];
  if (important) {
    important.heading.nextUntil('h1,h2,h3,h4').find('li,tr,p').each((_, el) => {
      const raw = normalize($(el).text());
      const date = dateFromText(raw);
      if (date) importantDates.push({ label: normalize(raw.replace(/[:\-–—]?\s*(?:\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}|\d{4}[\/.\-]\d{1,2}[\/.\-]\d{1,2}|(?:Jan\w*|Feb\w*|Mar\w*|Apr\w*|May|Jun\w*|Jul\w*|Aug\w*|Sep\w*|Oct\w*|Nov\w*|Dec\w*)\s+\d{1,2},?\s+\d{4})/i, '')), date: date.toISOString().slice(0, 10) });
    });
  }

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
  const listed = allListed.slice(0, DETAIL_LIMIT);
  let detailsUpdated = 0;
  await Promise.all(listed.map(async (conference) => {
      const externalId = `easychair:${conference.acronym.toLowerCase()}`;
      await prisma.notification.upsert({
        where: { externalId },
        create: { externalId, type: 'conference', title: conference.fullName, fullName: conference.fullName, acronym: conference.acronym, cfpLink: conference.cfpLink, link: conference.cfpLink, source: 'easychair', topics: [] },
        update: { title: conference.fullName, fullName: conference.fullName, cfpLink: conference.cfpLink, link: conference.cfpLink },
      });
      try {
        const response = await fetchWithTimeout(conference.cfpLink, { cache: 'no-store', headers: { 'User-Agent': 'BeyondEvidence conference sync/1.0' } });
        if (!response.ok) throw new Error(`Detail request failed (${response.status})`);
        const detail = parseDetail(await response.text());
        await prisma.notification.update({
          where: { externalId },
          data: { ...detail, topics: detail.topicSections.flatMap(topic => topic.items), lastDetailFetch: new Date() },
        });
        detailsUpdated++;
      } catch (error) { console.warn(`Could not update ${conference.acronym}`, error); }
    }));
  return { listed: allListed.length, synced: listed.length, detailsUpdated, limit: DETAIL_LIMIT };
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
