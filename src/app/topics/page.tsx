import { getTopics } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import TopicsClient from './TopicsClient';

const FALLBACK_TOPICS = [
  { _id: '1', name: 'Crime Scene Investigation', moduleCount: 14, description: 'Scene control, evidence collection, and professional chain of custody protocols.', imageUrl: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80' },
  { _id: '2', name: 'DNA and Serology', moduleCount: 22, description: 'Advanced sampling strategies and rigid contamination control methodologies.', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80' },
  { _id: '3', name: 'Cyber Forensics', moduleCount: 31, description: 'Device triage, volatile memory analysis, and digital artifact recovery.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80' },
  { _id: '4', name: 'Forensic Toxicology', moduleCount: 19, description: 'Toxic agent screening via HPLC and advanced spectroscopic methods.', imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80' },
  { _id: '5', name: 'Forensic Psychology', moduleCount: 12, description: 'Scientific interview techniques and evidence-based behavioral analysis.', imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80' },
  { _id: '6', name: 'Ballistics & Toolmarks', moduleCount: 16, description: 'Weapon mechanics and advanced ballistic trajectory reconstruction.', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' },
  { _id: '7', name: 'Forensic Anthropology', moduleCount: 9, description: 'Skeletal profiling, age estimation, and trauma identification.', imageUrl: 'https://images.unsplash.com/photo-1582213702581-67852b75306e?auto=format&fit=crop&q=80' },
  { _id: '8', name: 'Environmental Forensics', moduleCount: 7, description: 'Field sampling protocols for archaeological and environmental remediation.', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80' },
];

export default async function TopicsPage() {
  let topics;
  try {
    topics = await getTopics();
  } catch (e) {
    topics = null;
  }

  const resolvedTopics = (topics && topics.length > 0 ? topics : FALLBACK_TOPICS).map((t: any) => ({
    ...t,
    resolvedImage: getImageUrl(t, t.imageUrl),
  }));

  return <TopicsClient topics={resolvedTopics} />;
}
