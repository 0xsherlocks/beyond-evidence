import { getQuizSubjects } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import QuizClient from './QuizClient';

const FALLBACK_SUBJECTS = [
  { _id: '1', name: 'General Forensics', slug: 'general-forensics', questionCount: 0 },
  { _id: '2', name: 'Cyber Forensic', slug: 'cyber-forensic', questionCount: 0 },
  { _id: '3', name: 'DNA & Serology', slug: 'dna-serology', questionCount: 0 },
  { _id: '4', name: 'Questioned Document', slug: 'questioned-document', questionCount: 0 },
  { _id: '5', name: 'Fingerprint', slug: 'fingerprint', questionCount: 0 },
  { _id: '6', name: 'Forensic Anthropology', slug: 'forensic-anthropology', questionCount: 0 },
  { _id: '7', name: 'Forensic Toxicology', slug: 'forensic-toxicology', questionCount: 0 },
  { _id: '8', name: 'Forensic Ballistics', slug: 'forensic-ballistics', questionCount: 0 },
  { _id: '9', name: 'Forensic Photography', slug: 'forensic-photography', questionCount: 0 },
  { _id: '10', name: 'Forensic Medicine', slug: 'forensic-medicine', questionCount: 0 },
  { _id: '11', name: 'Multimedia Forensic', slug: 'multimedia-forensic', questionCount: 0 },
  { _id: '12', name: 'Forensic Physics', slug: 'forensic-physics', questionCount: 0 },
  { _id: '13', name: 'Crime Scene Investigation', slug: 'crime-scene-investigation', questionCount: 0 },
  { _id: '14', name: 'Forensic Psychology', slug: 'forensic-psychology', questionCount: 0 },
  { _id: '15', name: 'Forensic Nanotechnology', slug: 'forensic-nanotechnology', questionCount: 0 },
  { _id: '16', name: 'Environmental Forensic', slug: 'environmental-forensic', questionCount: 0 },
  { _id: '17', name: 'Wildlife Forensic', slug: 'wildlife-forensic', questionCount: 0 },
];

export default async function QuizPage() {
  let subjects;
  try {
    subjects = await getQuizSubjects();
  } catch (e) {
    subjects = null;
  }

  const resolvedSubjects = (subjects && subjects.length > 0 ? subjects : FALLBACK_SUBJECTS).map((s: any) => ({
    ...s,
    resolvedImage: getImageUrl(s, s.imageUrl),
  }));

  return <QuizClient subjects={resolvedSubjects} />;
}
