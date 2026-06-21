import { getNotificationPage, getDfssVacancies, getNotifications } from '@/src/sanity/queries';
import { fetchAllRssFeeds } from '@/src/lib/fetchRss';
import NotificationClient from './NotificationClient';

export const dynamic = 'force-dynamic';

const DEFAULT_FEEDS = [
  { url: 'https://govtjobsblog.in/feed' },
  { url: 'https://indiajoblive.com/feed' },
  { url: 'https://govtjobsdiary.com/feed' },
  { url: 'https://sarkarinaukriblog.com/feed' },
  { url: 'https://careerpower.in/blog/feed' },
  { url: 'https://www.careerindia.com/rss/feeds/careerindia-fb.xml' },
  { url: 'https://forensicsciencepublicdeskindia.wordpress.com/feed' },
  { url: 'https://rss.app/feeds/ZadugYCvZqD2LsPJ.xml', sourceName: 'Govt Job Portal 1' },
  { url: 'https://rss.app/feeds/25eKZHugSM1VlIbN.xml', sourceName: 'Govt Job Portal 2' },
];

export default async function NotificationPage() {
  // Fetch Notification Page Settings
  let pageSettings;
  try {
    pageSettings = await getNotificationPage();
  } catch (e) {
    pageSettings = null;
  }

  const title = pageSettings?.title || 'Updates & Alerts';
  const description = pageSettings?.description || 'Stay updated with the latest announcements, job vacancies, and important updates from Beyond Evidence and around the forensic network.';
  
  // Combine default feeds and Sanity feeds, removing duplicates
  const sanityFeeds = pageSettings?.rssFeeds || [];
  
  // Use a Map to ensure unique URLs, prioritizing Sanity feeds if they have custom source names
  const feedMap = new Map();
  
  // Add defaults first
  DEFAULT_FEEDS.forEach(feed => feedMap.set(feed.url, feed));
  
  // Add sanity feeds (will overwrite defaults if same URL, allowing user to rename them)
  sanityFeeds.forEach((feed: any) => {
    if (feed.url) feedMap.set(feed.url, feed);
  });
  
  const rssFeeds = Array.from(feedMap.values());

  // Fetch DFSS Vacancies from Sanity
  let dfssVacancies: any[] = [];
  try {
    const rawDfss = await getDfssVacancies();
    dfssVacancies = rawDfss || [];
  } catch (e) {
    console.error("Failed to fetch DFSS vacancies", e);
  }

  // Fetch RSS Feeds dynamically
  let feedItems: any[] = [];
  try {
    feedItems = await fetchAllRssFeeds(rssFeeds);
  } catch (e) {
    console.error("Failed to fetch RSS feeds", e);
  }

  // Fetch Manual Notifications
  let manualNotifications: any[] = [];
  try {
    manualNotifications = await getNotifications();
  } catch (e) {
    console.error("Failed to fetch manual notifications", e);
  }

  return (
    <NotificationClient 
      title={title}
      description={description}
      dfssVacancies={dfssVacancies} 
      feedItems={feedItems} 
      manualNotifications={manualNotifications}
    />
  );
}
