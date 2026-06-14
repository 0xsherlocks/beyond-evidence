/**
 * Seed script to populate Sanity with initial data from the hardcoded content.
 * 
 * Usage:
 *   1. Create a write token at: https://www.sanity.io/manage/project/tihvclm6/api#tokens
 *   2. Run: SANITY_API_TOKEN=your_token node scripts/seed.mjs
 *   
 *   On Windows PowerShell:
 *   $env:SANITY_API_TOKEN="your_token"; node scripts/seed.mjs
 */

const PROJECT_ID = 'tihvclm6';
const DATASET = 'production';
const API_VERSION = '2024-01-01';
const TOKEN = process.env.SANITY_API_TOKEN;

if (!TOKEN) {
  console.error('❌ Missing SANITY_API_TOKEN environment variable.');
  console.error('');
  console.error('To generate a token:');
  console.error('  1. Go to https://www.sanity.io/manage/project/tihvclm6/api#tokens');
  console.error('  2. Create a token with "Editor" permissions');
  console.error('  3. Run this script with the token:');
  console.error('');
  console.error('  PowerShell:  $env:SANITY_API_TOKEN="your_token"; node scripts/seed.mjs');
  console.error('  Bash:        SANITY_API_TOKEN=your_token node scripts/seed.mjs');
  process.exit(1);
}

const MUTATIONS_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;

async function mutate(mutations) {
  const res = await fetch(MUTATIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Document data ────────────────────────────────────────────

const documents = [
  // ── Site Settings ──
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'Beyond Evidence',
    description: 'A curated database for technical investigators, bridging theoretical research, field SOPs, and advanced laboratory methodology.',
  },

  // ── Navigation ──
  {
    _id: 'navigation',
    _type: 'navigation',
    headerLinks: [
      { _key: 'h1', label: 'Topics', href: '/topics' },
      { _key: 'h2', label: 'Research Desk', href: '/research' },
      { _key: 'h3', label: 'Quiz', href: '/quiz' },
      { _key: 'h4', label: 'Contact', href: '/contact' },
    ],
    footerLinks: [
      { _key: 'f1', label: 'About', href: '/about' },
      { _key: 'f2', label: 'Contact', href: '/contact' },
      { _key: 'f3', label: 'Legal', href: '/legal' },
    ],
  },

  // ── Home Page ──
  {
    _id: 'homePage',
    _type: 'homePage',
    heroTitle: 'Decode the Unseen.',
    heroTitleLine2: 'Master Intelligence.',
    heroHighlight: 'Proving everything with forensic science.',
    heroDescription: 'Empowering students and professionals with top-tier customized courses, expert guidance, and comprehensive learning resources to excel in the field.',
    valuePropEyebrow: 'The Curriculum',
    valuePropTitle: 'Structured for Discovery',
    valueProps: [
      { _key: 'vp1', title: 'Case-led Modules', description: 'Step-by-step forensic notes following evidence trails from field to lab.', iconName: 'BookOpen', imageUrl: 'https://images.unsplash.com/photo-1590103254922-bb7971777d19?auto=format&fit=crop&q=80' },
      { _key: 'vp2', title: 'Lab-first Workflows', description: 'Scientific analytical methodologies verified against real-world SOPs.', iconName: 'Microscope', imageUrl: 'https://images.unsplash.com/photo-1579154273874-9467262276cb?auto=format&fit=crop&q=80' },
      { _key: 'vp3', title: 'Exam-ready Prep', description: 'Specialized revision paths for forensic PG entrances and global certifications.', iconName: 'BookCheck', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80' },
    ],
    featuredTopicsEyebrow: 'Interactive Index',
    featuredTopicsTitle: 'Explore the Disciplines',
    featuredTopics: [
      { _key: 'ft1', name: 'CSI Scene Protocol', number: '01', imageUrl: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80', link: '/topics' },
      { _key: 'ft2', name: 'DNA & Serology', number: '02', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80', link: '/topics' },
      { _key: 'ft3', name: 'Cyber Forensics', number: '03', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', link: '/topics' },
      { _key: 'ft4', name: 'Toxicology', number: '04', imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80', link: '/topics' },
    ],
    bannerTitle: 'Accelerate the Intelligence Cycle.',
    bannerDescription: 'Join a network of academic researchers and investigators contributing to our peer-reviewed knowledge base.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
    bannerCta1Text: 'Join the Network',
    bannerCta1Link: '/studio',
    bannerCta2Text: 'Contact Board',
    bannerCta2Link: '/contact',
  },

  // ── About Page ──
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    heroTitle: 'About Beyond Evidence',
    heroDescription: 'Bridging the gap between theoretical forensic science and real-world investigation through premier education.',
    missionTitle: 'Decoding the Truth, Empowering Minds.',
    missionBodySimple: 'Beyond Evidence prioritizes clarity and structured discovery. We move away from dense, unstructured textbooks and toward interactive evidence mapping, making complex forensic concepts accessible and engaging.\n\nOur platform is designed for students preparing for crucial exams, researchers developing new methodologies, and enthusiasts passionate about the pursuit of truth through science.',
    missionImageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
    methodologyTitle: 'Our Methodology',
    methodologyDescription: 'We focus on high-yield topics, practical skill drills, and interconnected learning to ensure mastery of forensic sciences.',
    methodologyFeatures: [
      { _key: 'mf1', title: 'Compact Theory', description: 'Distilled, precision-focused notes centered around high-yield exam topics and crucial laboratory methodologies.', iconName: 'BookOpen' },
      { _key: 'mf2', title: 'Visual Evidence Maps', description: 'Connect the dots. See intuitively how specific crime scene findings correlate seamlessly to rigorous lab results.', iconName: 'Compass' },
      { _key: 'mf3', title: 'Targeted Skill Drills', description: 'Practice and apply scientific methodologies rigorously until they become second nature and muscle memory.', iconName: 'Target' },
    ],
  },

  // ── Contact Page ──
  {
    _id: 'contactPage',
    _type: 'contactPage',
    heroTitle: 'Get in Touch',
    heroDescription: 'Call or email to book an appointment, seek student guidance, or collaborate on forensic modules.',
    contactDescription: "Whether you're a student seeking academic support, preparing for UGC-NET, or a professional looking to collaborate on forensic research, we are here for you. Schedule an appointment or reach out with inquiries directly via phone or email.",
    phone: '8429492976',
    email: 'beyondevidence7@gmail.com',
    socialLinks: [
      { _key: 'sl1', platform: 'whatsapp', url: 'https://chat.whatsapp.com/EokYCPFbvcp7XLiUSy8Qha' },
      { _key: 'sl2', platform: 'instagram', url: 'https://www.instagram.com/beyond_evidence_' },
      { _key: 'sl3', platform: 'linkedin', url: 'https://www.linkedin.com/in/beyond-evidence7/' },
    ],
    businessHours: [
      { _key: 'bh1', days: 'Monday to Wednesday', hours: '9 a.m. – 6 p.m.' },
      { _key: 'bh2', days: 'Thursday to Friday', hours: '9 a.m. – 8 p.m.' },
      { _key: 'bh3', days: 'Saturday', hours: '9 a.m. – 6 p.m.' },
    ],
    closedNote: 'Closed on Sundays',
  },

  // ── Legal Page ──
  {
    _id: 'legalPage',
    _type: 'legalPage',
    heroTitle: 'Legal Information',
    heroDescription: 'Terms of Service, Privacy Policy, and Disclaimers.',
    sections: [
      { _key: 'ls1', heading: 'Terms of Service', contentSimple: 'Welcome to Beyond Evidence. By accessing or using our platform, you agree to be bound by these Terms of Service. All content provided on Beyond Evidence is for educational and informational purposes only. The platform and its owners make no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.' },
      { _key: 'ls2', heading: 'Privacy Policy', contentSimple: "Your privacy is important to us. It is Beyond Evidence's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent." },
      { _key: 'ls3', heading: 'Disclaimer', contentSimple: 'The material on this website is provided "as is" without any guarantees, conditions, or warranties as to its accuracy. To the extent permitted by law, we expressly exclude all conditions, warranties, and other terms which might otherwise be implied by statute, common law, or the law of equity.' },
    ],
    contactEmail: 'beyondevidence7@gmail.com',
  },

  // ── Topics ──
  { _id: 'topic-1', _type: 'topic', name: 'Crime Scene Investigation', slug: { _type: 'slug', current: 'crime-scene-investigation' }, description: 'Scene control, evidence collection, and professional chain of custody protocols.', imageUrl: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80', moduleCount: 14, order: 1 },
  { _id: 'topic-2', _type: 'topic', name: 'DNA and Serology', slug: { _type: 'slug', current: 'dna-and-serology' }, description: 'Advanced sampling strategies and rigid contamination control methodologies.', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80', moduleCount: 22, order: 2 },
  { _id: 'topic-3', _type: 'topic', name: 'Cyber Forensics', slug: { _type: 'slug', current: 'cyber-forensics' }, description: 'Device triage, volatile memory analysis, and digital artifact recovery.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', moduleCount: 31, order: 3 },
  { _id: 'topic-4', _type: 'topic', name: 'Forensic Toxicology', slug: { _type: 'slug', current: 'forensic-toxicology' }, description: 'Toxic agent screening via HPLC and advanced spectroscopic methods.', imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80', moduleCount: 19, order: 4 },
  { _id: 'topic-5', _type: 'topic', name: 'Forensic Psychology', slug: { _type: 'slug', current: 'forensic-psychology' }, description: 'Scientific interview techniques and evidence-based behavioral analysis.', imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80', moduleCount: 12, order: 5 },
  { _id: 'topic-6', _type: 'topic', name: 'Ballistics & Toolmarks', slug: { _type: 'slug', current: 'ballistics-toolmarks' }, description: 'Weapon mechanics and advanced ballistic trajectory reconstruction.', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80', moduleCount: 16, order: 6 },
  { _id: 'topic-7', _type: 'topic', name: 'Forensic Anthropology', slug: { _type: 'slug', current: 'forensic-anthropology' }, description: 'Skeletal profiling, age estimation, and trauma identification.', imageUrl: 'https://images.unsplash.com/photo-1582213702581-67852b75306e?auto=format&fit=crop&q=80', moduleCount: 9, order: 7 },
  { _id: 'topic-8', _type: 'topic', name: 'Environmental Forensics', slug: { _type: 'slug', current: 'environmental-forensics' }, description: 'Field sampling protocols for archaeological and environmental remediation.', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80', moduleCount: 7, order: 8 },

  // ── Research Articles ──
  { _id: 'article-1', _type: 'researchArticle', title: 'HPLC Methods for Synthetic Cannabinoids', tag: 'Journal Roundup', author: 'Dr. L. Vance', date: '2023-10-12', imageUrl: 'https://images.unsplash.com/photo-1544648156-5388451882c5?auto=format&fit=crop&q=80', order: 1 },
  { _id: 'article-2', _type: 'researchArticle', title: 'Bone Density Post-Mortem Interval Protocol', tag: 'SOP', author: 'A. Torres', date: '2023-11-04', imageUrl: 'https://images.unsplash.com/photo-1582213702581-67852b75306e?auto=format&fit=crop&q=80', order: 2 },
  { _id: 'article-3', _type: 'researchArticle', title: 'Evidence Trail: Digital Heist Reconstruction', tag: 'Case Library', author: 'L. Nguyen', date: '2023-12-18', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', order: 3 },

  // ── Webinar ──
  { _id: 'webinar-1', _type: 'webinar', title: 'Master Forensic Ballistics', description: 'Advanced webinar series on firearm toolmark identification and trajectory analysis architectures.', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80', ctaText: 'Register for Webinar', isActive: true },

  // ── Learning Tracks ──
  { _id: 'track-1', _type: 'learningTrack', title: 'UGC-NET Track', description: 'Question banks & unit-wise technical notes.', order: 1 },
  { _id: 'track-2', _type: 'learningTrack', title: 'Lab Skills Builder', description: 'Instrumental analysis & protocol design.', order: 2 },
  { _id: 'track-3', _type: 'learningTrack', title: 'Case Review Sprints', description: 'Intense evidence scene training simulations.', order: 3 },

  // ── Quiz Questions ──
  { _id: 'quiz-1', _type: 'quizQuestion', question: 'What is the primary purpose of the chain of custody in forensic science?', options: ['To identify the suspect', 'To maintain the integrity and traceability of evidence', 'To determine the time of death', 'To analyze DNA samples'], correctAnswer: 1, order: 1 },
  { _id: 'quiz-2', _type: 'quizQuestion', question: "Which of the following is considered 'trace evidence'?", options: ['A murder weapon', 'A laptop computer', 'A single strand of hair', 'A detailed witness statement'], correctAnswer: 2, order: 2 },
  { _id: 'quiz-3', _type: 'quizQuestion', question: 'In DNA profiling, what does STR stand for?', options: ['Sequence Tandem Repeat', 'Short Tandem Repeat', 'Standard Toxicological Result', 'Signal Trace Recovery'], correctAnswer: 1, order: 3 },
];

// ─── Execute ──────────────────────────────────────────────────

async function seed() {
  console.log(`🌱 Seeding ${documents.length} documents to Sanity project ${PROJECT_ID}...`);
  console.log('');

  const mutations = documents.map(doc => ({
    createOrReplace: doc,
  }));

  // Batch in groups of 10 to avoid rate limits
  const BATCH_SIZE = 10;
  for (let i = 0; i < mutations.length; i += BATCH_SIZE) {
    const batch = mutations.slice(i, i + BATCH_SIZE);
    try {
      await mutate(batch);
      console.log(`  ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} documents created`);
    } catch (err) {
      console.error(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err.message);
    }
  }

  console.log('');
  console.log('🎉 Seed complete! Open Sanity Studio to verify: http://localhost:3000/studio');
}

seed().catch(console.error);
