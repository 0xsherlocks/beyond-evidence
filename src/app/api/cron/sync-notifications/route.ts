import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { prisma } from '@/src/lib/prisma';
import { getNotificationPage } from '@/src/sanity/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const defaultFeeds = [
  'https://govtjobsblog.in/feed', 'https://indiajoblive.com/feed', 'https://govtjobsdiary.com/feed',
  'https://sarkarinaukriblog.com/feed', 'https://careerpower.in/blog/feed',
  'https://www.careerindia.com/rss/feeds/careerindia-fb.xml', 'https://forensicsciencepublicdeskindia.wordpress.com/feed',
  'https://rss.app/feeds/ZadugYCvZqD2LsPJ.xml', 'https://rss.app/feeds/25eKZHugSM1VlIbN.xml',
];

function typeFor(title: string) {
  const value = title.toLowerCase();
  if (value.includes('conference') || value.includes('call for papers') || value.includes('cfp')) return 'conference';
  if (value.includes('intern')) return 'internship';
  if (value.includes('exam') || value.includes('admit card') || value.includes('result')) return 'exam';
  if (value.includes('scholarship') || value.includes('fellowship')) return 'scholarship';
  if (value.includes('workshop') || value.includes('seminar')) return 'workshop';
  if (value.includes('job') || value.includes('recruitment') || value.includes('vacancy') || value.includes('hiring')) return 'job';
  return 'other';
}
const externalId = (value: string) => `rss:${createHash('sha256').update(value).digest('hex')}`;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parser = new Parser();
  let synced = 0;
  const errors: string[] = [];
  let feeds = defaultFeeds.map(url => ({ url, sourceName: undefined as string | undefined }));
  try {
    const settings = await getNotificationPage();
    const configured = (settings?.rssFeeds || []).filter((feed: any) => feed?.url && feed.enabled !== false);
    // Once feeds are configured in Sanity, Sanity becomes the source of truth.
    // Until then, the existing defaults keep the first sync useful.
    if (configured.length) feeds = configured.map((feed: any) => ({ url: feed.url, sourceName: feed.sourceName }));
  } catch (error) { errors.push(`Sanity feed settings: ${error instanceof Error ? error.message : 'failed'}`); }
  for (const feedConfig of feeds) {
    const feedUrl = feedConfig.url;
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const item of feed.items) {
        const link = item.link || item.guid || '';
        const id = externalId(link || `${feedUrl}:${item.title}`);
        const publishedAt = item.isoDate || item.pubDate ? new Date(item.isoDate || item.pubDate!) : null;
        await prisma.notification.upsert({
          where: { externalId: id },
          create: { externalId: id, type: typeFor(item.title || ''), title: item.title || 'Untitled notification', excerpt: item.contentSnippet || item.content || null, link: item.link || null, source: feedConfig.sourceName || feed.title || new URL(feedUrl).hostname, publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null, isNew: true },
          update: { title: item.title || 'Untitled notification', excerpt: item.contentSnippet || item.content || null, link: item.link || null, source: feedConfig.sourceName || feed.title || new URL(feedUrl).hostname, publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : undefined },
        });
        synced++;
      }
    } catch (error) { errors.push(`${feedUrl}: ${error instanceof Error ? error.message : 'failed'}`); }
  }
  const conferenceUrl = new URL('/api/cron/sync-conferences', request.url);
  const conferenceResponse = await fetch(conferenceUrl, { headers: secret ? { authorization: `Bearer ${secret}` } : {} }).catch(error => {
    errors.push(`EasyChair: ${error instanceof Error ? error.message : 'failed'}`);
    return null;
  });
  const conferences = conferenceResponse?.ok ? await conferenceResponse.json() : { synced: 0, detailsUpdated: 0 };
  if (conferenceResponse && !conferenceResponse.ok) errors.push(`EasyChair: request failed (${conferenceResponse.status})`);
  const stale = await prisma.notification.updateMany({ where: { publishedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, isNew: true }, data: { isNew: false } });
  return NextResponse.json({ synced, conferences, markedOld: stale.count, errors });
}
