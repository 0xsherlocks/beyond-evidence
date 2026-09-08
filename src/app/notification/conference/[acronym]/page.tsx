import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getConference } from '@/src/lib/conferences';
import ConferenceDetailClient from './ConferenceDetailClient';

type Props = { params: Promise<{ acronym: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { acronym } = await params;
  const conf = await getConference(acronym);
  if (!conf) return { title: 'Conference | Beyond Evidence' };
  return {
    title: `${conf.acronym} 2026 - ${conf.fullName} | Beyond Evidence`,
    description: conf.description?.slice(0, 160),
    keywords: conf.topics.join(', '),
  };
}

export default async function ConferencePage({ params }: Props) {
  const { acronym } = await params;
  const conf = await getConference(acronym);
  if (!conf) notFound();
  return <ConferenceDetailClient conference={JSON.parse(JSON.stringify(conf))} />;
}
