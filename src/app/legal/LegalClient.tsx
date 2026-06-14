import PageHero from '@/src/components/PageHero';

interface LegalSection {
  heading: string;
  contentSimple?: string;
  content?: any[];
}

interface LegalClientProps {
  heroTitle: string;
  heroDescription: string;
  sections: LegalSection[];
  contactEmail: string;
}

export default function LegalClient(props: LegalClientProps) {
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        title={props.heroTitle}
        description={props.heroDescription}
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-slate max-w-none">
          {props.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-4">{section.heading}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {section.contentSimple || ''}
              </p>
            </div>
          ))}

          <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-4">Contact</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            If you have any questions about our Terms of Service or Privacy Policy, please contact us at{' '}
            <a href={`mailto:${props.contactEmail}`} className="text-accent underline font-medium">{props.contactEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
