import { getHomePage } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import HomePageClient from './HomePageClient';

// Fallback data when Sanity has no content yet
const FALLBACK = {
  heroTitle: 'The Ultimate Hub for',
  heroTitleLine2: 'Forensic Science.',
  heroHighlight: 'Education. Research. Career. All in one place.',
  heroDescription: 'Explore in-depth study materials, test your knowledge with interactive quizzes, discover the latest jobs, and access cutting-edge research to advance your forensic career.',
  valuePropEyebrow: 'Our Features',
  valuePropTitle: 'Why Choose Beyond Evidence?',
  valueProps: [
    { title: "Live Job Alerts", description: "Get the latest updates on forensic vacancies, internships, and government exams delivered instantly.", iconName: "BellRing", imageUrl: "https://images.unsplash.com/photo-1590103254922-bb7971777d19?auto=format&fit=crop&q=80", link: "/notification" },
    { title: "Mock Tests", description: "Test your preparation with high-quality, exam-pattern question sets and detailed performance analytics.", iconName: "BookCheck", imageUrl: "https://images.unsplash.com/photo-1579154273874-9467262276cb?auto=format&fit=crop&q=80", link: "/quiz" },
    { title: "UGC NET Focused", description: "Premium study material perfectly aligned with the latest NTA UGC NET syllabus for Forensic Science.", iconName: "Target", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80", link: "/study-material/ugc-net-jrf" },
  ],
  featuredTopicsEyebrow: 'Explore Subjects',
  featuredTopicsTitle: 'Browse the Syllabus',
  featuredTopics: [
    { name: 'Crime Scene Investigation', number: '01', imageUrl: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80', link: '/syllabus' },
    { name: 'DNA & Serology', number: '02', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80', link: '/syllabus' },
    { name: 'Cyber Forensics', number: '03', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', link: '/syllabus' },
    { name: 'Forensic Toxicology', number: '04', imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80', link: '/syllabus' },
  ],
  bannerTitle: 'Start Your Preparation Today.',
  bannerDescription: 'Access premium study materials and take the first step towards your dream career in forensic science.',
  bannerImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
  bannerCta1Text: 'View Study Materials',
  bannerCta1Link: '/study-material',
  bannerCta2Text: 'Contact Us',
  bannerCta2Link: '/contact',
};

export default async function Home() {
  let data;
  try {
    data = await getHomePage();
  } catch (e) {
    data = null;
  }

  const page = data || FALLBACK;

  // Resolve image URLs
  // Force override the old Sanity database value props with the updated comprehensive ones
  const valueProps = FALLBACK.valueProps.map((vp: any) => ({
    ...vp,
    resolvedImage: getImageUrl(vp, vp.imageUrl),
  }));

  const featuredTopics = (page.featuredTopics || FALLBACK.featuredTopics).map((ft: any) => ({
    ...ft,
    resolvedImage: getImageUrl(ft, ft.imageUrl),
  }));

  return (
    <HomePageClient
      // Forcing the new professional text directly from code
      heroTitle={FALLBACK.heroTitle}
      heroTitleLine2={FALLBACK.heroTitleLine2}
      heroHighlight={FALLBACK.heroHighlight}
      heroDescription={FALLBACK.heroDescription}
      valuePropEyebrow={FALLBACK.valuePropEyebrow}
      valuePropTitle={FALLBACK.valuePropTitle}
      valueProps={valueProps}
      featuredTopicsEyebrow={FALLBACK.featuredTopicsEyebrow}
      featuredTopicsTitle={FALLBACK.featuredTopicsTitle}
      featuredTopics={featuredTopics}
      bannerTitle={FALLBACK.bannerTitle}
      bannerDescription={FALLBACK.bannerDescription}
      bannerImageUrl={page.bannerImageUrl || FALLBACK.bannerImageUrl}
      bannerCta1Text={FALLBACK.bannerCta1Text}
      bannerCta1Link={page.bannerCta1Link || FALLBACK.bannerCta1Link}
      bannerCta2Text={FALLBACK.bannerCta2Text}
      bannerCta2Link={page.bannerCta2Link || FALLBACK.bannerCta2Link}
    />
  );
}
