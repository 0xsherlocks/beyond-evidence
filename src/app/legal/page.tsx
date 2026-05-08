import PageHero from '@/src/components/PageHero';

export default function Legal() {
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        title="Legal Information"
        description="Terms of Service, Privacy Policy, and Disclaimers."
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-4">Terms of Service</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Welcome to Beyond Evidence. By accessing or using our platform, you agree to be bound by these Terms of Service. All content provided on Beyond Evidence is for educational and informational purposes only. The platform and its owners make no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.
          </p>

          <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-4">Privacy Policy</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Your privacy is important to us. It is Beyond Evidence's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
          </p>
          
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-4">Disclaimer</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The material on this website is provided "as is" without any guarantees, conditions, or warranties as to its accuracy. To the extent permitted by law, we expressly exclude all conditions, warranties, and other terms which might otherwise be implied by statute, common law, or the law of equity.
          </p>

          <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-4">Contact</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            If you have any questions about our Terms of Service or Privacy Policy, please contact us at <a href="mailto:beyondevidence7@gmail.com" className="text-accent underline font-medium">beyondevidence7@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
