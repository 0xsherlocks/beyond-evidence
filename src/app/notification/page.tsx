import { getNotifications } from '@/src/sanity/queries';
import PageHero from '@/src/components/PageHero';

export const dynamic = 'force-dynamic';

const FALLBACK_NOTIFICATIONS = [
  {
    _id: '1',
    title: 'Welcome to Beyond Evidence',
    message: 'Your forensic science learning journey begins here. Explore our curated topics, research articles, and interactive quizzes.',
    isNew: true,
    timestamp: 'Just now',
  },
  {
    _id: '2',
    title: 'New Topics Coming Soon',
    message: 'We are preparing new modules on Digital Forensics and Wildlife Crime Investigation. Stay tuned for updates.',
    isNew: false,
    timestamp: 'Coming soon',
  },
];

export default async function NotificationPage() {
  let notifications;
  try {
    notifications = await getNotifications();
  } catch (e) {
    notifications = null;
  }

  const items = notifications && notifications.length > 0 ? notifications : FALLBACK_NOTIFICATIONS;

  return (
    <div className="min-h-screen">
      <PageHero
        title="Notifications"
        description="Stay updated with the latest announcements, alerts, and important updates from Beyond Evidence."
      />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-24">
        <div className="space-y-6">
          {items.map((item: any) => (
            <div
              key={item._id || item.title}
              className={`card-panel p-8 ${item.isNew ? 'border-l-4 border-accent' : 'opacity-60'}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                    item.isNew ? 'bg-accent animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-light leading-relaxed mb-3">
                    {item.message}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
