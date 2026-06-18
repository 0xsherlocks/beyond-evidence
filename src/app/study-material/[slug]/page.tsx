import { getStudyMaterialBySlug, getContactPage } from '@/src/sanity/queries';
import StudyMaterialDetailClient from './StudyMaterialDetailClient';
import { notFound } from 'next/navigation';

const FALLBACK_DATA: Record<string, any> = {
  'ugc-net-jrf': {
    title: 'UGC NET JRF – Forensic Science Study Material',
    description: 'Complete notes for all 10 units and a mock test series curated as per the latest UGC NET/JRF syllabus.',
    introParagraphs: [
      'Dear Student,',
      'Greetings! Thank you for showing interest in the UGC NET JRF – Forensic Science study material.',
      'To support your preparation, I have curated high-quality, updated, and exam-focused study resources designed as per the latest NET/JRF syllabus. These materials are built to help you revise efficiently and perform confidently on exam day.'
    ],
    features: [
      { title: 'Complete Notes — All 10 Units', description: 'Clear, structured, and exam-focused notes covering every topic in the syllabus.', iconName: 'BookOpen' },
      { title: 'Mock Test Series', description: 'Practice tests designed to strengthen your concepts, improve speed, and boost accuracy before the exam.', iconName: 'ClipboardList' },
      { title: 'Digital PDF Format', description: 'Instantly downloadable PDFs for easy reading on any device, anytime — perfect for quick revision.', iconName: 'FileText' },
    ],
    packages: [
      { id: 'notes', title: 'Notes Only', subtitle: 'All 10 Units', price: '₹999', featuresList: ['Complete Notes — All 10 Units', 'Structured & Easy-to-Revise Format', 'PDF Digital Download', 'Latest NET/JRF Syllabus Aligned'] },
      { id: 'mock', title: 'Mock Tests Only', subtitle: 'Full Test Series', price: '₹666', featuresList: ['Mock Test Series', 'Concept Strengthening Questions', 'Answer Keys Included', 'Exam-Pattern Based'] },
      { id: 'combo', title: 'Combo Pack', subtitle: 'Notes + Mock Tests', price: '₹1499', badge: 'BEST VALUE', featuresList: ['Complete Notes — All 10 Units', 'Full Mock Test Series', 'PDF Digital Downloads', 'Priority Support'] },
    ]
  },
  'fact-and-fact-plus': {
    title: 'FACT & FACT Plus Study Material',
    description: 'Comprehensive study material and previous year question analysis for FACT and FACT Plus exams.',
    introParagraphs: [
      'Dear Student,',
      'Welcome to the FACT & FACT Plus preparation course.',
      'This material is designed to cover the exact syllabus and pattern of the Forensic Aptitude and Caliber Test, ensuring you are fully prepared for both basic and advanced levels.'
    ],
    features: [
      { title: 'Targeted Notes', description: 'Notes specific to FACT & FACT Plus requirements.', iconName: 'BookOpen' },
      { title: 'Previous Year Analysis', description: 'Detailed breakdown of previous year papers.', iconName: 'ClipboardList' },
    ],
    packages: [
      { id: 'full', title: 'Complete Package', subtitle: 'Notes + PYQs', price: '₹1299', badge: 'RECOMMENDED', featuresList: ['Targeted Notes', 'PYQ Analysis', 'PDF Downloads'] }
    ]
  },
  'jsa': {
    title: 'JSA (Junior Scientific Assistant) Preparation',
    description: 'Targeted notes and mock tests for the JSA examination.',
    introParagraphs: ['Welcome to the JSA preparation module. We have compiled the best resources to help you crack the Junior Scientific Assistant exam.'],
    features: [{ title: 'JSA Specific Notes', description: 'Covering all core forensic principles required for JSA.', iconName: 'BookOpen' }],
    packages: [{ id: 'full', title: 'Complete Course', subtitle: 'Notes + Tests', price: '₹899', featuresList: ['Core Notes', 'Practice Tests'] }]
  },
  'ssa': {
    title: 'SSA (Senior Scientific Assistant) Preparation',
    description: 'Advanced study material for the SSA examination.',
    introParagraphs: ['Welcome to the SSA preparation module. This material covers advanced topics required for the Senior Scientific Assistant role.'],
    features: [{ title: 'Advanced Notes', description: 'In-depth coverage of specialized forensic fields.', iconName: 'BookOpen' }],
    packages: [{ id: 'full', title: 'Complete Course', subtitle: 'Notes + Tests', price: '₹1099', featuresList: ['Advanced Notes', 'Mock Exams'] }]
  },
  'sso': {
    title: 'SSO (Senior Scientific Officer) Preparation',
    description: 'Expert-level material for Senior Scientific Officer candidates.',
    introParagraphs: ['Welcome to the SSO preparation module. Designed for professionals aiming for the Senior Scientific Officer designation.'],
    features: [{ title: 'Expert Notes', description: 'High-level scientific and administrative protocols.', iconName: 'BookOpen' }],
    packages: [{ id: 'full', title: 'Complete Course', subtitle: 'Comprehensive Material', price: '₹1999', badge: 'ELITE', featuresList: ['Expert Level Notes', 'Case Studies', 'Interview Prep Guide'] }]
  }
};

export default async function StudyMaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let material;
  try {
    material = await getStudyMaterialBySlug(slug);
  } catch (e) {
    material = null;
  }

  if (!material) {
    material = FALLBACK_DATA[slug];
  }

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
    phone: contactPage?.phone || '8429492976'
  };

  return <StudyMaterialDetailClient material={material} contactInfo={contactInfo} />;
}
