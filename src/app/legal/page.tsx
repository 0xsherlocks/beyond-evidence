import { getLegalPage } from '@/src/sanity/queries';
import LegalClient from './LegalClient';

const FALLBACK = {
  heroTitle: 'Legal Information',
  heroDescription: 'Terms of Service, Privacy Policy, and Disclaimers. Last updated: June 2026.',
  sections: [
    {
      heading: 'Terms of Service',
      contentSimple: 'Welcome to Beyond Evidence. By accessing or using our platform, you agree to be bound by these Terms of Service. Beyond Evidence provides educational resources, study materials, and career updates for forensic science students. You agree to use this platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else\'s use of the website.',
    },
    {
      heading: 'Intellectual Property & Copyright',
      contentSimple: 'All content on Beyond Evidence, including but not limited to study materials, quizzes, articles, logos, and graphics, is the exclusive property of Beyond Evidence and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, modify, or commercially exploit any content without our express written permission. Unauthorized distribution of our study materials is strictly prohibited.',
    },
    {
      heading: 'Privacy Policy',
      contentSimple: "Your privacy is important to us. Beyond Evidence collects necessary personal information (such as name and email address) solely to provide and improve our educational services, manage user accounts, and communicate important updates. We implement standard security measures to protect your data and do not sell, trade, or rent your personal identification information to third parties. By using our site, you consent to our collection and use of this information.",
    },
    {
      heading: 'Disclaimer of Affiliation',
      contentSimple: 'Beyond Evidence is an independent educational platform. We are not officially affiliated with, endorsed by, or connected to the National Testing Agency (NTA), the University Grants Commission (UGC), or any other government body or examination authority. While we strive to align our materials with the latest syllabus (e.g., UGC NET), our content is meant for supplementary preparation and we do not guarantee exam results.',
    },
    {
      heading: 'General Disclaimer',
      contentSimple: 'The materials on this website are provided on an "as is" and "as available" basis. Beyond Evidence makes no warranties, expressed or implied, and hereby disclaims all warranties, including without limitation, implied warranties or conditions of merchantability or fitness for a particular purpose. We do not warrant that the platform will be uninterrupted or error-free.',
    },
    {
      heading: 'Governing Law',
      contentSimple: 'These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of India.',
    },
  ],
  contactEmail: 'beyondevidence7@gmail.com',
};

export default async function LegalPage() {
  let data;
  try {
    data = await getLegalPage();
  } catch (e) {
    data = null;
  }

  const page = data || FALLBACK;

  return (
    <LegalClient
      heroTitle={page.heroTitle || FALLBACK.heroTitle}
      heroDescription={page.heroDescription || FALLBACK.heroDescription}
      sections={page.sections || FALLBACK.sections}
      contactEmail={page.contactEmail || FALLBACK.contactEmail}
    />
  );
}
