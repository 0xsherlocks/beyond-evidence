import { getHomePage, getNotifications } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import HomePageClient from './HomePageClient';

// Fallback data used when Sanity has no content yet or a field is missing
const FALLBACK = {
  heroTitle: 'The Ultimate Hub for',
  heroTitleLine2: 'Forensic Science.',
  heroHighlight: 'Education, Research, Career & Much More — All in one place.',
  heroDescription: 'Explore in-depth study materials, test your knowledge with interactive quizzes, discover the latest jobs, and access cutting-edge research to advance your forensic career.',
  heroCtaPrimaryText: 'Explore Courses',
  heroCtaPrimaryLink: '/courses',
  heroCtaSecondaryText: 'Research Desk',
  heroCtaSecondaryLink: '/research',
  valuePropEyebrow: 'Our Features',
  valuePropTitle: 'Why Choose Beyond Evidence?',
  valueProps: [
    { title: "Live Job Alerts", description: "Get the latest updates on forensic vacancies, internships, and government exams delivered instantly.", iconName: "BellRing", imageUrl: "https://images.unsplash.com/photo-1590103254922-bb7971777d19?auto=format&fit=crop&q=80", link: "/notification" },
    { title: "Mock Tests", description: "Test your preparation with high-quality, exam-pattern question sets and detailed performance analytics.", iconName: "BookCheck", imageUrl: "https://images.unsplash.com/photo-1579154273874-9467262276cb?auto=format&fit=crop&q=80", link: "/quiz" },
    { title: "UGC NET Focused", description: "Premium study material perfectly aligned with the latest NTA UGC NET courses for Forensic Science.", iconName: "Target", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80", link: "/study-material" },
  ],
  featuredTopicsEyebrow: 'Explore Subjects',
  featuredTopicsTitle: 'Browse the Courses',
  featuredTopics: [
    { name: 'Crime Scene Investigation', number: '01', imageUrl: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80', link: '/courses' },
    { name: 'DNA & Serology', number: '02', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80', link: '/courses' },
    { name: 'Cyber Forensics', number: '03', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', link: '/courses' },
    { name: 'Forensic Toxicology', number: '04', imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80', link: '/courses' },
  ],
  newsletterTitle: 'Stay Updated with Our Latest Training Programs',
  newsletterDescription: 'Get notified about new training programs, special offers, and educational content',
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
  let latestNotification = null;
  try {
    data = await getHomePage();
    const notifications = await getNotifications();
    if (notifications && notifications.length > 0) {
      latestNotification = notifications[0];
    }
  } catch (e) {
    console.error("Error fetching Home page data from Sanity:", e);
    data = null;
  }

  const page = data || {};

  // Each field: Sanity first, FALLBACK second
  const heroTitle             = page.heroTitle             || FALLBACK.heroTitle;
  const heroTitleLine2        = page.heroTitleLine2        || FALLBACK.heroTitleLine2;
  const heroHighlight         = page.heroHighlight         || FALLBACK.heroHighlight;
  const heroDescription       = page.heroDescription       || FALLBACK.heroDescription;
  const heroCtaPrimaryText    = page.heroCtaPrimaryText    || FALLBACK.heroCtaPrimaryText;
  const heroCtaPrimaryLink    = page.heroCtaPrimaryLink    || FALLBACK.heroCtaPrimaryLink;
  const heroCtaSecondaryText  = page.heroCtaSecondaryText  || FALLBACK.heroCtaSecondaryText;
  const heroCtaSecondaryLink  = page.heroCtaSecondaryLink  || FALLBACK.heroCtaSecondaryLink;
  const valuePropEyebrow      = page.valuePropEyebrow      || FALLBACK.valuePropEyebrow;
  const valuePropTitle        = page.valuePropTitle        || FALLBACK.valuePropTitle;
  const featuredTopicsEyebrow = page.featuredTopicsEyebrow || FALLBACK.featuredTopicsEyebrow;
  const featuredTopicsTitle   = page.featuredTopicsTitle   || FALLBACK.featuredTopicsTitle;
  const newsletterTitle       = page.newsletterTitle       || FALLBACK.newsletterTitle;
  const newsletterDescription = page.newsletterDescription || FALLBACK.newsletterDescription;
  const bannerTitle           = page.bannerTitle           || FALLBACK.bannerTitle;
  const bannerDescription     = page.bannerDescription     || FALLBACK.bannerDescription;
  const bannerImageUrl        = page.bannerImageUrl        || FALLBACK.bannerImageUrl;
  const bannerCta1Text        = page.bannerCta1Text        || FALLBACK.bannerCta1Text;
  const bannerCta1Link        = page.bannerCta1Link        || FALLBACK.bannerCta1Link;
  const bannerCta2Text        = page.bannerCta2Text        || FALLBACK.bannerCta2Text;
  const bannerCta2Link        = page.bannerCta2Link        || FALLBACK.bannerCta2Link;

  const rawValueProps = page.valueProps?.length > 0 ? page.valueProps : FALLBACK.valueProps;
  const valueProps = rawValueProps.map((vp: any) => ({
    ...vp,
    resolvedImage: getImageUrl(vp, vp.imageUrl),
  }));

  const rawFeaturedTopics = page.featuredTopics?.length > 0 ? page.featuredTopics : FALLBACK.featuredTopics;
  const featuredTopics = rawFeaturedTopics.map((ft: any) => ({
    ...ft,
    resolvedImage: getImageUrl(ft, ft.imageUrl),
  }));

  return (
    <HomePageClient
      latestNotification={latestNotification}
      heroTitle={heroTitle}
      heroTitleLine2={heroTitleLine2}
      heroHighlight={heroHighlight}
      heroDescription={heroDescription}
      heroCtaPrimaryText={heroCtaPrimaryText}
      heroCtaPrimaryLink={heroCtaPrimaryLink}
      heroCtaSecondaryText={heroCtaSecondaryText}
      heroCtaSecondaryLink={heroCtaSecondaryLink}
      valuePropEyebrow={valuePropEyebrow}
      valuePropTitle={valuePropTitle}
      valueProps={valueProps}
      featuredTopicsEyebrow={featuredTopicsEyebrow}
      featuredTopicsTitle={featuredTopicsTitle}
      featuredTopics={featuredTopics}
      newsletterTitle={newsletterTitle}
      newsletterDescription={newsletterDescription}
      bannerTitle={bannerTitle}
      bannerDescription={bannerDescription}
      bannerImageUrl={bannerImageUrl}
      bannerCta1Text={bannerCta1Text}
      bannerCta1Link={bannerCta1Link}
      bannerCta2Text={bannerCta2Text}
      bannerCta2Link={bannerCta2Link}
    />
  );
}
