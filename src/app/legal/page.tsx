import { getLegalPage } from '@/src/sanity/queries';
import LegalClient from './LegalClient';

const FALLBACK = {
  heroTitle: 'Legal Information',
  heroDescription: 'Terms of Service, Privacy Policy, and Disclaimers.',
  sections: [
    {
      heading: 'Terms of Service',
      contentSimple: 'Welcome to Beyond Evidence. By accessing or using our platform, you agree to be bound by these Terms of Service. All content provided on Beyond Evidence is for educational and informational purposes only. The platform and its owners make no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.',
    },
    {
      heading: 'Privacy Policy',
      contentSimple: "Your privacy is important to us. It is Beyond Evidence's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.",
    },
    {
      heading: 'Disclaimer',
      contentSimple: 'The material on this website is provided "as is" without any guarantees, conditions, or warranties as to its accuracy. To the extent permitted by law, we expressly exclude all conditions, warranties, and other terms which might otherwise be implied by statute, common law, or the law of equity.',
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
