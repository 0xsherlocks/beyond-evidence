'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ChevronDown, Clock3, ExternalLink, FileText, Mail, MapPin, Send, Tag } from 'lucide-react';

type ImportantDate = { label: string; date: string };
type TopicSection = { sectionTitle: string; items: string[] };
type CommitteeMember = { role: string; name: string; affiliation?: string };
const asArray = <T,>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];

const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : null;
const dateRange = (start?: string | null, end?: string | null) => {
  if (!start) return null;
  return end ? `${formatDate(start)} – ${formatDate(end)}` : formatDate(start);
};

export default function ConferenceDetailClient({ conference: conf }: { conference: any }) {
  const dates = asArray<ImportantDate>(conf.importantDates);
  const topicSections = asArray<TopicSection>(conf.topicSections);
  const committees = asArray<CommitteeMember>(conf.committees);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => Object.fromEntries(topicSections.map((topic, index) => [topic.sectionTitle || String(index), index === 0])));
  const deadline = conf.submissionDeadline ? new Date(conf.submissionDeadline) : null;
  const daysRemaining = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86400000) : null;
  const roles = [...new Set(committees.map(member => member.role))];

  return <main className="min-h-screen bg-[#fafaff] py-8 md:py-12">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <Link href="/notification" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-[#6C4EF6]"><ArrowLeft className="h-4 w-4" /> Back to Notifications</Link>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
        <article className="min-w-0 space-y-8">
          <header className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm md:p-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[#6C4EF6]">Conference call for papers</p>
            <h1 className="font-display text-4xl font-extrabold text-[#6C4EF6] md:text-5xl">{conf.acronym}</h1>
            <h2 className="mt-3 font-display text-xl font-bold text-slate-900 md:text-2xl">{conf.fullName}</h2>
            <p className="mt-3 text-slate-500">{[conf.location, dateRange(conf.startDate, conf.endDate)].filter(Boolean).join(' · ') || 'Conference details coming soon'}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {conf.location && <Chip icon={<MapPin />} text={conf.location} />}
              {conf.submissionDeadline && <Chip icon={<Clock3 />} text={`Deadline: ${formatDate(conf.submissionDeadline)}`} />}
              {conf.startDate && <Chip icon={<CalendarDays />} text={dateRange(conf.startDate, conf.endDate)!} />}
            </div>
          </header>
          {conf.description && <Section title="About"><Text value={conf.description} /></Section>}
          {(conf.submissionGuidelines || dates.length > 0) && <Section title="Submission Guidelines">
            {conf.submissionGuidelines && <Text value={conf.submissionGuidelines} />}
            {dates.length > 0 && <div className="mt-6 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/40">
              {dates.map((item, index) => <div className="flex items-center justify-between gap-4 border-b border-violet-100 px-5 py-4 last:border-0" key={`${item.label}-${index}`}><span className="flex items-center gap-3 text-sm font-semibold text-slate-700"><FileText className="h-4 w-4 text-[#6C4EF6]" />{item.label}</span><time className="shrink-0 text-sm font-bold text-slate-900">{formatDate(item.date)}</time></div>)}
            </div>}
          </Section>}
          {(topicSections.length > 0 || conf.topics.length > 0) && <Section title="Topics of Interest"><div className="space-y-3">
            {(topicSections.length ? topicSections : [{ sectionTitle: 'Topics', items: conf.topics }]).map((topic, index) => { const key = topic.sectionTitle || String(index); const open = openSections[key]; return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={key}><button type="button" onClick={() => setOpenSections(value => ({ ...value, [key]: !open }))} className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-900"><span>{topic.sectionTitle}</span><ChevronDown className={`h-5 w-5 text-[#6C4EF6] transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <ul className="space-y-2 border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">{topic.items.map((item, itemIndex) => <li className="flex gap-2" key={`${item}-${itemIndex}`}><span className="text-[#6C4EF6]">•</span>{item}</li>)}</ul>}</div>; })}
          </div></Section>}
          {committees.length > 0 && <Section title="Committees"><div className="grid gap-5 md:grid-cols-2">{roles.map(role => <div className="rounded-2xl border border-slate-200 bg-white p-5" key={role}><h3 className="mb-4 font-display font-bold text-slate-900">{role}</h3><div className="space-y-3">{committees.filter(member => member.role === role).map((member, index) => <div key={`${member.name}-${index}`}><p className="text-sm font-bold text-slate-800">{member.name}</p>{member.affiliation && <p className="text-sm text-slate-500">{member.affiliation}</p>}</div>)}</div></div>)}</div></Section>}
          {(conf.publication || conf.venue) && <div className="grid gap-8 md:grid-cols-2">{conf.publication && <Section title="Publication"><Text value={conf.publication} /></Section>}{conf.venue && <Section title="Venue"><Text value={conf.venue} /></Section>}</div>}
        </article>
        <aside className="lg:sticky lg:top-24 lg:h-fit"><div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl">
          <p className="text-xs font-bold tracking-[.16em] text-violet-300">SUBMIT YOUR PAPER</p>{conf.submissionLink ? <a href={conf.submissionLink} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-between rounded-xl bg-[#6C4EF6] px-4 py-3 text-sm font-bold hover:bg-violet-500">Submit via EasyChair <Send className="h-4 w-4" /></a> : <p className="mt-2 text-sm text-slate-400">Submission link pending</p>}
          <div className="my-6 border-t border-slate-700" />
          <p className="text-xs font-bold tracking-[.16em] text-violet-300">CONFERENCE WEBSITE</p>{conf.conferenceWebPage ? <a href={conf.conferenceWebPage} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-violet-300">Visit Official Site <ExternalLink className="h-4 w-4" /></a> : <p className="mt-2 text-sm text-slate-400">Website pending</p>}
          {deadline && <><div className="my-6 border-t border-slate-700" /><p className="text-xs font-bold tracking-[.16em] text-violet-300">DEADLINE</p><p className="mt-2 text-lg font-bold">{formatDate(conf.submissionDeadline)}</p><p className={`mt-1 text-sm font-bold ${daysRemaining !== null && daysRemaining < 14 ? 'text-rose-400' : 'text-emerald-400'}`}>{daysRemaining !== null ? `${Math.max(0, daysRemaining)} days remaining` : ''}</p></>}
          <div className="my-6 border-t border-slate-700" /><p className="text-xs font-bold tracking-[.16em] text-violet-300">QUICK INFO</p><div className="mt-3 space-y-2 text-sm text-slate-200">{conf.location && <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-violet-300" />{conf.location}</p>}{conf.startDate && <p className="flex gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-violet-300" />{dateRange(conf.startDate, conf.endDate)}</p>}{conf.topics.length > 0 && <p className="flex gap-2"><Tag className="h-4 w-4 shrink-0 text-violet-300" />{conf.topics.slice(0, 4).join(', ')}</p>}</div>
          {conf.contactEmail && <><div className="my-6 border-t border-slate-700" /><p className="text-xs font-bold tracking-[.16em] text-violet-300">CONTACT</p><a className="mt-2 flex items-center gap-2 text-sm text-white hover:text-violet-300" href={`mailto:${conf.contactEmail}`}><Mail className="h-4 w-4" />{conf.contactEmail}</a></>}
        </div></aside>
      </div>
    </div>
  </main>;
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) { return <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">{icon && <span className="h-4 w-4">{icon}</span>}{text}</span>; }
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8"><h2 className="font-display text-2xl font-bold text-slate-900">{title}</h2><div className="mt-5">{children}</div></section>; }
function Text({ value }: { value: string }) { return <p className="whitespace-pre-line text-[15px] font-light leading-7 text-slate-600">{value}</p>; }
