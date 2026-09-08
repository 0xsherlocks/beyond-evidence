"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PageHero from '@/src/components/PageHero';
import { Calendar, ExternalLink, Filter, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import type { FeedItem } from '@/src/lib/fetchRss';

interface Props { title: string; description: string; dfssVacancies: any[]; feedItems: FeedItem[]; manualNotifications?: any[]; conferences?: any[]; }
const categories = ['All', 'Jobs', 'Internships', 'Exams', 'Scholarships', 'Workshops', 'Conference', 'Other'];
const formatDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Recent' : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date); };

export default function NotificationClient({ title, description, dfssVacancies, feedItems, manualNotifications = [], conferences = [] }: Props) {
  const router = useRouter(), pathname = usePathname(), params = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [serverItems, setServerItems] = useState<any[] | null>(null);
  const type = params.get('type') || 'All', query = params.get('q') || '';
  const update = (changes: Record<string, string>) => { const next = new URLSearchParams(params.toString()); Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key)); router.replace(`${pathname}${next.toString() ? `?${next}` : ''}`, { scroll: false }); };
  const alerts = useMemo(() => [...dfssVacancies.map(v => ({ id: v._id || v.fingerprint, title: v.title, link: v.notificationUrl || v.sourceUrl, pubDate: v.date || v.scrapedAt, source: 'DFS India (Govt)', category: 'Job' })), ...feedItems].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()), [dfssVacancies, feedItems]);
  const matching = (text: string) => text.toLowerCase().includes(query.toLowerCase());
  useEffect(() => {
    const controller = new AbortController();
    const queryString = new URLSearchParams();
    if (type !== 'All') queryString.set('type', type);
    if (query) queryString.set('q', query);
    fetch(`/api/notifications?${queryString}`, { signal: controller.signal }).then(response => response.ok ? response.json() : Promise.reject()).then(setServerItems).catch(() => { if (!controller.signal.aborted) setServerItems(null); });
    return () => controller.abort();
  }, [type, query]);
  const remoteConferences = serverItems?.filter(item => item.type === 'conference') || conferences;
  const remoteAlerts = serverItems ? serverItems.filter(item => item.type !== 'conference').map(item => ({ id: item.id, title: item.title, link: item.link || '#', pubDate: item.publishedAt || item.lastUpdated, source: item.source, category: item.type.charAt(0).toUpperCase() + item.type.slice(1) })) : alerts;
  const filteredAlerts = remoteAlerts.filter(item => (type === 'All' || item.category === type || `${item.category}s` === type) && matching(`${item.title} ${item.source}`));
  const filteredConferences = remoteConferences.filter(conf => (type === 'All' || type === 'Conference') && matching(`${conf.acronym} ${conf.fullName} ${conf.location || ''} ${(conf.topics || []).join(' ')}`));
  const activeCount = (type !== 'All' ? 1 : 0) + (query ? 1 : 0);
  const Filters = ({ mobile = false }: { mobile?: boolean }) => <div className="space-y-6">
    <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Search</label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e => update({ q: e.target.value })} placeholder="Search alerts..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#6C4EF6]" /></div></div>
    <div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Type</p><div className="space-y-1">{categories.map(category => <button key={category} onClick={() => { update({ type: category === 'All' ? '' : category }); if (mobile) setDrawer(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${type === category ? 'bg-violet-100 text-[#6C4EF6]' : 'text-slate-600 hover:bg-slate-100'}`}>{category}</button>)}</div></div>
    {activeCount > 0 && <button onClick={() => update({ type: '', q: '' })} className="text-sm font-bold text-[#6C4EF6]">Clear filters</button>}
  </div>;
  return <div className="min-h-screen pb-24"><PageHero title={title} description={description} />
    {manualNotifications.length > 0 && <section className="mx-auto max-w-7xl px-5 py-10 md:px-8"><h2 className="mb-5 font-display text-2xl font-bold text-slate-900">Official Announcements</h2><div className="grid gap-4 md:grid-cols-2">{manualNotifications.map(notif => <Link key={notif._id} href={notif.slug ? `/notification/${notif.slug}` : '#'} className="rounded-2xl border-l-4 border-[#6C4EF6] bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">{notif.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-500">{notif.excerpt}</p></Link>)}</div></section>}
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:px-8 lg:grid-cols-[260px_minmax(0,1fr)]"><aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center gap-2 font-display font-bold text-slate-900"><SlidersHorizontal className="h-4 w-4 text-[#6C4EF6]" /> Filters</div><Filters /></div></aside>
      <main className="min-w-0"><div className="mb-8"><h2 className="font-display text-3xl font-bold text-slate-900">Live Alerts & Conferences</h2><p className="mt-1 text-sm text-slate-500">Official sources, RSS feeds, and current calls for papers.</p></div>
        {filteredConferences.length > 0 && <section className="mb-10"><div className="mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-[#6C4EF6]" /><h3 className="font-display text-xl font-bold text-slate-900">Conferences</h3></div><div className="grid gap-5 md:grid-cols-2">{filteredConferences.map(conf => <article className="flex flex-col rounded-2xl border border-violet-100 bg-white p-5 shadow-sm" key={conf.id}><div className="flex items-start justify-between gap-3"><span className="rounded bg-violet-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6C4EF6]">Conference</span>{conf.submissionDeadline && <span className="text-xs font-semibold text-rose-600">Deadline {formatDate(conf.submissionDeadline)}</span>}</div><h4 className="mt-4 font-display text-xl font-bold text-slate-900">{conf.acronym}</h4><p className="mt-1 line-clamp-2 text-sm text-slate-600">{conf.fullName}</p>{conf.location && <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{conf.location}</p>}<div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><Link href={`/notification/conference/${encodeURIComponent(conf.acronym)}`} className="text-sm font-bold text-[#6C4EF6]">View Details</Link><a href={conf.cfpLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">View CFP <ExternalLink className="h-3.5 w-3.5" /></a></div></article>)}</div></section>}
        <section><h3 className="mb-4 font-display text-xl font-bold text-slate-900">Alerts</h3><div className="grid gap-5 md:grid-cols-2">{filteredAlerts.map((item, index) => <article className="flex min-h-48 flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100" key={`${item.id}-${index}`}><div className="flex gap-2"><span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">{item.source}</span><span className="rounded bg-violet-50 px-2 py-1 text-[10px] font-bold uppercase text-[#6C4EF6]">{item.category}</span></div><h4 className="mt-4 font-bold leading-snug text-slate-900">{item.title}</h4><div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs text-slate-400">{item.pubDate ? formatDate(item.pubDate) : 'Recent'}</span><a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#6C4EF6]">View Details <ExternalLink className="h-3.5 w-3.5" /></a></div></article>)}</div>{!filteredAlerts.length && !filteredConferences.length && <div className="py-16 text-center text-slate-500"><Filter className="mx-auto mb-3 h-7 w-7 text-slate-300" />No items match these filters.</div>}</section>
      </main></div>
    <button onClick={() => setDrawer(true)} className="fixed bottom-5 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#6C4EF6] px-5 py-3 text-sm font-bold text-white shadow-lg lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters{activeCount ? ` (${activeCount})` : ''}</button>
    {drawer && <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setDrawer(false)}><div className="absolute bottom-0 max-h-[80vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-6" onClick={e => e.stopPropagation()}><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-xl font-bold">Filters</h2><button onClick={() => setDrawer(false)} aria-label="Close filters"><X /></button></div><Filters mobile /></div></div>}
  </div>;
}
