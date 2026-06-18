import { getSubjects } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import SyllabusClient from './SyllabusClient';

const FALLBACK_SUBJECTS = [
  { _id: '1', name: 'General Forensics', slug: 'general-forensics', moduleCount: 0, description: 'Core principles and methodologies in forensic science.' },
  { _id: '2', name: 'Cyber Forensic', slug: 'cyber-forensic', moduleCount: 0, description: 'Digital evidence acquisition, analysis, and network forensics.' },
  { _id: '3', name: 'DNA & Serology', slug: 'dna-serology', moduleCount: 0, description: 'Biological evidence analysis, DNA profiling, and serological testing.' },
  { _id: '4', name: 'Questioned Document', slug: 'questioned-document', moduleCount: 0, description: 'Handwriting analysis, ink examination, and document authentication.' },
  { _id: '5', name: 'Fingerprint', slug: 'fingerprint', moduleCount: 0, description: 'Latent print development, classification, and AFIS comparison.' },
  { _id: '6', name: 'Forensic Anthropology', slug: 'forensic-anthropology', moduleCount: 0, description: 'Skeletal identification, age estimation, and trauma analysis.' },
  { _id: '7', name: 'Forensic Toxicology', slug: 'forensic-toxicology', moduleCount: 0, description: 'Detection and analysis of drugs, poisons, and toxic substances.' },
  { _id: '8', name: 'Forensic Ballistics', slug: 'forensic-ballistics', moduleCount: 0, description: 'Firearm identification, bullet trajectory, and toolmark analysis.' },
  { _id: '9', name: 'Forensic Photography', slug: 'forensic-photography', moduleCount: 0, description: 'Crime scene documentation, evidence photography, and image analysis.' },
  { _id: '10', name: 'Forensic Medicine', slug: 'forensic-medicine', moduleCount: 0, description: 'Medicolegal death investigation, autopsy procedures, and injury patterns.' },
  { _id: '11', name: 'Multimedia Forensic', slug: 'multimedia-forensic', moduleCount: 0, description: 'Audio-video authentication, deepfake detection, and media analysis.' },
  { _id: '12', name: 'Forensic Physics', slug: 'forensic-physics', moduleCount: 0, description: 'Accident reconstruction, glass fracture analysis, and physical evidence.' },
  { _id: '13', name: 'Crime Scene Investigation', slug: 'crime-scene-investigation', moduleCount: 0, description: 'Scene processing, evidence collection, and chain of custody protocols.' },
  { _id: '14', name: 'Forensic Psychology', slug: 'forensic-psychology', moduleCount: 0, description: 'Criminal profiling, behavioral analysis, and forensic assessment.' },
  { _id: '15', name: 'Forensic Nanotechnology', slug: 'forensic-nanotechnology', moduleCount: 0, description: 'Nanotechnology applications in evidence detection and analysis.' },
  { _id: '16', name: 'Environmental Forensic', slug: 'environmental-forensic', moduleCount: 0, description: 'Environmental contamination investigation and remediation evidence.' },
  { _id: '17', name: 'Wildlife Forensic', slug: 'wildlife-forensic', moduleCount: 0, description: 'Wildlife crime investigation, species identification, and poaching forensics.' },
];

export default async function SyllabusPage() {
  let subjects;
  try {
    subjects = await getSubjects();
  } catch (e) {
    subjects = null;
  }

  const resolvedSubjects = (subjects && subjects.length > 0 ? subjects : FALLBACK_SUBJECTS).map((s: any) => ({
    ...s,
    resolvedImage: getImageUrl(s, s.imageUrl),
  }));

  return <SyllabusClient subjects={resolvedSubjects} />;
}
