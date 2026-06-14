import { getAboutPage } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import AboutClient from './AboutClient';

const FALLBACK = {
  heroTitle: 'About Beyond Evidence',
  heroDescription: 'Bridging the gap between theoretical forensic science and real-world investigation through premier education.',
  missionTitle: 'Decoding the Truth, Empowering Minds.',
  missionBodySimple: 'Beyond Evidence prioritizes clarity and structured discovery. We move away from dense, unstructured textbooks and toward interactive evidence mapping, making complex forensic concepts accessible and engaging.\n\nOur platform is designed for students preparing for crucial exams, researchers developing new methodologies, and enthusiasts passionate about the pursuit of truth through science.',
  missionImageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
  methodologyTitle: 'Our Methodology',
  methodologyDescription: 'We focus on high-yield topics, practical skill drills, and interconnected learning to ensure mastery of forensic sciences.',
  methodologyFeatures: [
    { title: "Compact Theory", description: "Distilled, precision-focused notes centered around high-yield exam topics and crucial laboratory methodologies.", iconName: "BookOpen" },
    { title: "Visual Evidence Maps", description: "Connect the dots. See intuitively how specific crime scene findings correlate seamlessly to rigorous lab results.", iconName: "Compass" },
    { title: "Targeted Skill Drills", description: "Practice and apply scientific methodologies rigorously until they become second nature and muscle memory.", iconName: "Target" },
  ],
};

export default async function AboutPage() {
  let data;
  try {
    data = await getAboutPage();
  } catch (e) {
    data = null;
  }

  const page = data || FALLBACK;
  const missionImage = getImageUrl(page, page.missionImageUrl || FALLBACK.missionImageUrl);

  return (
    <AboutClient
      heroTitle={page.heroTitle || FALLBACK.heroTitle}
      heroDescription={page.heroDescription || FALLBACK.heroDescription}
      missionTitle={page.missionTitle || FALLBACK.missionTitle}
      missionBodySimple={page.missionBodySimple || FALLBACK.missionBodySimple}
      missionImage={missionImage}
      methodologyTitle={page.methodologyTitle || FALLBACK.methodologyTitle}
      methodologyDescription={page.methodologyDescription || FALLBACK.methodologyDescription}
      methodologyFeatures={page.methodologyFeatures || FALLBACK.methodologyFeatures}
    />
  );
}
