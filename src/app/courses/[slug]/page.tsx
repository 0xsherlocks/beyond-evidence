import { getSubjectBySlug, getSubjects } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import SubjectDetailClient from './SubjectDetailClient';
import { notFound } from 'next/navigation';

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let subject;
  try {
    subject = await getSubjectBySlug(slug);
  } catch (e) {
    subject = null;
  }

  if (!subject) {
    notFound();
  }

  const resolvedImage = getImageUrl(subject, subject.imageUrl);

  return <SubjectDetailClient subject={{ ...subject, resolvedImage }} />;
}
