import { getNotificationBySlug } from '@/src/sanity/queries';
import { notFound } from 'next/navigation';
import NotificationDetailClient from './NotificationDetailClient';

export default async function NotificationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let notification;
  try {
    notification = await getNotificationBySlug(slug);
  } catch (e) {
    notification = null;
  }

  if (!notification) {
    notFound();
  }

  return <NotificationDetailClient notification={notification} />;
}
