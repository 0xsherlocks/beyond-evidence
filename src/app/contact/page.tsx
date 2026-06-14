import { getContactPage } from '@/src/sanity/queries';
import ContactClient from './ContactClient';

const FALLBACK = {
  heroTitle: 'Get in Touch',
  heroDescription: 'Call or email to book an appointment, seek student guidance, or collaborate on forensic modules.',
  contactDescription: "Whether you're a student seeking academic support, preparing for UGC-NET, or a professional looking to collaborate on forensic research, we are here for you. Schedule an appointment or reach out with inquiries directly via phone or email.",
  phone: '8429492976',
  email: 'beyondevidence7@gmail.com',
  socialLinks: [
    { platform: 'whatsapp', url: 'https://chat.whatsapp.com/EokYCPFbvcp7XLiUSy8Qha' },
    { platform: 'instagram', url: 'https://www.instagram.com/beyond_evidence_' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/beyond-evidence7/' },
  ],
  businessHours: [
    { days: 'Monday to Wednesday', hours: '9 a.m. – 6 p.m.' },
    { days: 'Thursday to Friday', hours: '9 a.m. – 8 p.m.' },
    { days: 'Saturday', hours: '9 a.m. – 6 p.m.' },
  ],
  closedNote: 'Closed on Sundays',
};

export default async function ContactPage() {
  let data;
  try {
    data = await getContactPage();
  } catch (e) {
    data = null;
  }

  const page = data || FALLBACK;

  return (
    <ContactClient
      heroTitle={page.heroTitle || FALLBACK.heroTitle}
      heroDescription={page.heroDescription || FALLBACK.heroDescription}
      contactDescription={page.contactDescription || FALLBACK.contactDescription}
      phone={page.phone || FALLBACK.phone}
      email={page.email || FALLBACK.email}
      socialLinks={page.socialLinks || FALLBACK.socialLinks}
      businessHours={page.businessHours || FALLBACK.businessHours}
      closedNote={page.closedNote || FALLBACK.closedNote}
    />
  );
}
