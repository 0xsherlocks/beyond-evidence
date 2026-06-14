import { getHomePage } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import HomePageClient from './HomePageClient';

// Fallback data when Sanity has no content yet
const FALLBACK = {
  heroTitle: 'Decode the Unseen.',
  heroTitleLine2: 'Master Intelligence.',
  heroHighlight: 'Proving everything with forensic science.',
  heroDescription: 'Empowering students and professionals with top-tier customized courses, expert guidance, and comprehensive learning resources to excel in the field.',
  valuePropEyebrow: 'The Curriculum',
  valuePropTitle: 'Structured for Discovery',
  valueProps: [
    { title: "Case-led Modules", description: "Step-by-step forensic notes following evidence trails from field to lab.", iconName: "BookOpen", imageUrl: "https://images.unsplash.com/photo-1590103254922-bb7971777d19?auto=format&fit=crop&q=80" },
    { title: "Lab-first Workflows", description: "Scientific analytical methodologies verified against real-world SOPs.", iconName: "Microscope", imageUrl: "https://images.unsplash.com/photo-1579154273874-9467262276cb?auto=format&fit=crop&q=80" },
    { title: "Exam-ready Prep", description: "Specialized revision paths for forensic PG entrances and global certifications.", iconName: "BookCheck", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80" },
  ],
  featuredTopicsEyebrow: 'Interactive Index',
  featuredTopicsTitle: 'Explore the Disciplines',
  featuredTopics: [
    { name: 'CSI Scene Protocol', number: '01', imageUrl: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80', link: '/topics' },
    { name: 'DNA & Serology', number: '02', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80', link: '/topics' },
    { name: 'Cyber Forensics', number: '03', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', link: '/topics' },
    { name: 'Toxicology', number: '04', imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80', link: '/topics' },
  ],
  bannerTitle: 'Accelerate the Intelligence Cycle.',
  bannerDescription: 'Join a network of academic researchers and investigators contributing to our peer-reviewed knowledge base.',
  bannerImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
  bannerCta1Text: 'Join the Network',
  bannerCta1Link: '/studio',
  bannerCta2Text: 'Contact Board',
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
  const valueProps = (page.valueProps || FALLBACK.valueProps).map((vp: any) => ({
    ...vp,
    resolvedImage: getImageUrl(vp, vp.imageUrl),
  }));

  const featuredTopics = (page.featuredTopics || FALLBACK.featuredTopics).map((ft: any) => ({
    ...ft,
    resolvedImage: getImageUrl(ft, ft.imageUrl),
  }));

  return (
    <HomePageClient
      heroTitle={page.heroTitle || FALLBACK.heroTitle}
      heroTitleLine2={page.heroTitleLine2 || FALLBACK.heroTitleLine2}
      heroHighlight={page.heroHighlight || FALLBACK.heroHighlight}
      heroDescription={page.heroDescription || FALLBACK.heroDescription}
      valuePropEyebrow={page.valuePropEyebrow || FALLBACK.valuePropEyebrow}
      valuePropTitle={page.valuePropTitle || FALLBACK.valuePropTitle}
      valueProps={valueProps}
      featuredTopicsEyebrow={page.featuredTopicsEyebrow || FALLBACK.featuredTopicsEyebrow}
      featuredTopicsTitle={page.featuredTopicsTitle || FALLBACK.featuredTopicsTitle}
      featuredTopics={featuredTopics}
      bannerTitle={page.bannerTitle || FALLBACK.bannerTitle}
      bannerDescription={page.bannerDescription || FALLBACK.bannerDescription}
      bannerImageUrl={page.bannerImageUrl || FALLBACK.bannerImageUrl}
      bannerCta1Text={page.bannerCta1Text || FALLBACK.bannerCta1Text}
      bannerCta1Link={page.bannerCta1Link || FALLBACK.bannerCta1Link}
      bannerCta2Text={page.bannerCta2Text || FALLBACK.bannerCta2Text}
      bannerCta2Link={page.bannerCta2Link || FALLBACK.bannerCta2Link}
    />
  );
}
