import { getStudyMaterialBySlug, getContactPage } from '@/src/sanity/queries';
import StudyMaterialDetailClient from './StudyMaterialDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudyMaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = await getStudyMaterialBySlug(slug);

  if (!material) {
    notFound();
  }

  let contactPage;
  try {
    contactPage = await getContactPage();
  } catch (e) {
    contactPage = null;
  }

  const contactInfo = {
    email: contactPage?.email || 'gboy90raj@gmail.com',
    phone: contactPage?.phone || '8429492976',
  };

  return <StudyMaterialDetailClient material={material} contactInfo={contactInfo} />;
}
