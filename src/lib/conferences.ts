import { prisma } from '@/src/lib/prisma';

export type ImportantDate = { label: string; date: string };
export type TopicSection = { sectionTitle: string; items: string[] };
export type CommitteeMember = { role: string; name: string; affiliation?: string };

export async function getConference(acronym: string) {
  return prisma.notification.findFirst({ where: { type: 'conference', acronym: decodeURIComponent(acronym) } });
}

export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}
