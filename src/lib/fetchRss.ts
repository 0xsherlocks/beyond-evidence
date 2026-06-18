export interface FeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'Job' | 'Internship' | 'Exam' | 'Scholarship' | 'Workshop' | 'Other';
}

const RSS2JSON_API_KEY = 'oqoshapsei5mab1kooj89slrpdg1zuval5azcg1k';
const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';

export interface RssFeedConfig {
  url: string;
  sourceName?: string;
}

function getSourceFromUrl(url: string, rawSource?: string, customSourceName?: string): string {
  if (customSourceName) return customSourceName;
  if (rawSource && rawSource !== 'rss.app') return rawSource;
  
  if (url.includes('govtjobsblog')) return 'GovtJobsBlog';
  if (url.includes('indiajoblive')) return 'IndiaJobLive';
  if (url.includes('govtjobsdiary')) return 'GovtJobsDiary';
  if (url.includes('sarkarinaukriblog')) return 'SarkariNaukri';
  if (url.includes('careerpower')) return 'CareerPower';
  if (url.includes('careerindia')) return 'CareerIndia';
  if (url.includes('forensicscience')) return 'ForensicScience';
  return 'Job Portal';
}

function categorizeItem(title: string): FeedItem['category'] {
  const t = title.toLowerCase();
  if (t.includes('intern') || t.includes('internship')) return 'Internship';
  if (t.includes('exam') || t.includes('admit card') || t.includes('result') || t.includes('syllabus')) return 'Exam';
  if (t.includes('scholarship') || t.includes('fellowship')) return 'Scholarship';
  if (t.includes('workshop') || t.includes('seminar') || t.includes('conference')) return 'Workshop';
  if (t.includes('job') || t.includes('recruitment') || t.includes('vacancy') || t.includes('post') || t.includes('hiring')) return 'Job';
  return 'Other';
}

export async function fetchAllRssFeeds(feeds: RssFeedConfig[]): Promise<FeedItem[]> {
  const fetchPromises = feeds.map(async (feed) => {
    try {
      const apiUrl = `${RSS2JSON_BASE}?rss_url=${encodeURIComponent(feed.url)}&count=20&api_key=${RSS2JSON_API_KEY}`;
      const response = await fetch(apiUrl, { next: { revalidate: 7200 } }); // Cache for 2 hours
      
      if (!response.ok) {
        console.warn(`Failed to fetch RSS: ${feed.url}`);
        return [];
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok' || !data.items) {
        return [];
      }

      const sourceName = getSourceFromUrl(feed.url, data.feed?.title, feed.sourceName);

      return data.items.map((item: any) => {
        return {
          id: item.guid || item.link,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: sourceName,
          category: categorizeItem(item.title)
        } as FeedItem;
      });
    } catch (error) {
      console.warn(`Error fetching RSS: ${feed.url}`, error);
      return []; // Graceful failure
    }
  });

  const results = await Promise.all(fetchPromises);
  const allItems = results.flat();

  // Deduplicate by link and title
  const uniqueItems: FeedItem[] = [];
  const seenKeys = new Set();
  
  for (const item of allItems) {
    const key = `${item.title}-${item.link}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueItems.push(item);
    }
  }

  // Sort descending by pubDate
  uniqueItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return uniqueItems;
}
