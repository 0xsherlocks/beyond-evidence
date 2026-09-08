import { prisma } from '@/src/lib/prisma';
import NotificationClient from './NotificationClient';

export const dynamic = 'force-dynamic';

export default async function NotificationPage() {
  const rows = await prisma.notification.findMany({
    orderBy: [{ isNew: 'desc' }, { publishedAt: 'desc' }, { lastUpdated: 'desc' }],
    take: 100,
  });
  const conferences = rows.filter(item => item.type === 'conference');
  const feedItems = rows.filter(item => item.type !== 'conference').map(item => ({
    id: item.id, title: item.title, link: item.link || '#',
    pubDate: item.publishedAt?.toISOString() || item.lastUpdated.toISOString(),
    source: item.source, category: item.type.charAt(0).toUpperCase() + item.type.slice(1),
  }));
  return <NotificationClient title="Updates & Alerts" description="The latest announcements, opportunities, and calls for papers—synced from trusted sources." dfssVacancies={[]} feedItems={feedItems as any} manualNotifications={[]} conferences={JSON.parse(JSON.stringify(conferences))} />;
}
