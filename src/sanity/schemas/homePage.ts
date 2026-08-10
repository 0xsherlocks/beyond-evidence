import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // ─── Hero Section ───────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Title (Line 1)',
      type: 'string',
      description: 'First line of the large hero heading. e.g. "The Ultimate Hub for"',
      initialValue: 'The Ultimate Hub for',
    }),
    defineField({
      name: 'heroTitleLine2',
      title: 'Hero Title (Line 2 — accent colour)',
      type: 'string',
      description: 'Second line shown in accent purple. e.g. "Forensic Science."',
      initialValue: 'Forensic Science.',
    }),
    defineField({
      name: 'heroHighlight',
      title: 'Hero Highlight (bold sub-text)',
      type: 'string',
      description: 'Short bold sentence below the heading.',
      initialValue: 'Education, Research, Career & Much More — All in one place.',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      description: 'Paragraph beneath the highlight text.',
      initialValue: 'Explore in-depth study materials, test your knowledge with interactive quizzes, discover the latest jobs, and access cutting-edge research to advance your forensic career.',
    }),
    defineField({
      name: 'heroCtaPrimaryText',
      title: 'Hero CTA Button Text (Primary)',
      type: 'string',
      description: 'Label for the filled purple button.',
      initialValue: 'Explore Courses',
    }),
    defineField({
      name: 'heroCtaPrimaryLink',
      title: 'Hero CTA Button Link (Primary)',
      type: 'string',
      description: 'URL for the primary CTA button. e.g. /courses',
      initialValue: '/courses',
    }),
    defineField({
      name: 'heroCtaSecondaryText',
      title: 'Hero CTA Link Text (Secondary)',
      type: 'string',
      description: 'Label for the text-only secondary link.',
      initialValue: 'Research Desk',
    }),
    defineField({
      name: 'heroCtaSecondaryLink',
      title: 'Hero CTA Link (Secondary)',
      type: 'string',
      description: 'URL for the secondary CTA link. e.g. /research',
      initialValue: '/research',
    }),

    // ─── Value Proposition Section ───────────────────────────────────
    defineField({
      name: 'valuePropEyebrow',
      title: 'Value Prop — Eyebrow Label',
      type: 'string',
      description: 'Small uppercase label above the section heading.',
      initialValue: 'Our Features',
    }),
    defineField({
      name: 'valuePropTitle',
      title: 'Value Prop — Section Heading',
      type: 'string',
      description: 'Main heading for the 3-card features section.',
      initialValue: 'Why Choose Beyond Evidence?',
    }),
    defineField({
      name: 'valueProps',
      title: 'Value Proposition Cards (3 recommended)',
      type: 'array',
      description: 'The feature highlight cards shown in a 3-column grid.',
      initialValue: [
        { title: 'Live Job Alerts', description: 'Get the latest updates on forensic vacancies, internships, and government exams delivered instantly.', iconName: 'BellRing', link: '/notification' },
        { title: 'Mock Tests', description: 'Test your preparation with high-quality, exam-pattern question sets and detailed performance analytics.', iconName: 'BookCheck', link: '/quiz' },
        { title: 'UGC NET Focused', description: 'Premium study material perfectly aligned with the latest NTA UGC NET courses for Forensic Science.', iconName: 'Target', link: '/study-material' },
      ],
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Card Title', type: 'string' }),
            defineField({ name: 'description', title: 'Card Description', type: 'text', rows: 2 }),
            defineField({
              name: 'iconName',
              title: 'Icon Name',
              type: 'string',
              description: 'lucide-react icon name. Supported: BookOpen, Microscope, BookCheck, BellRing, Target',
            }),
            defineField({ name: 'image', title: 'Background Image (Sanity asset)', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageUrl', title: 'Background Image URL (external fallback)', type: 'url' }),
            defineField({ name: 'link', title: 'Click Link (optional)', type: 'string', description: 'e.g. /study-material' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'iconName' },
          },
        },
      ],
    }),

    // ─── Featured Topics Section ─────────────────────────────────────
    defineField({
      name: 'featuredTopicsEyebrow',
      title: 'Featured Topics — Eyebrow Label',
      type: 'string',
      initialValue: 'Explore Subjects',
    }),
    defineField({
      name: 'featuredTopicsTitle',
      title: 'Featured Topics — Section Heading',
      type: 'string',
      initialValue: 'Browse the Courses',
    }),
    defineField({
      name: 'featuredTopics',
      title: 'Featured Topic Cards',
      type: 'array',
      description: 'The subject cards in the topics grid. Recommended: 4 items.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Subject Name', type: 'string' }),
            defineField({ name: 'number', title: 'Display Number', type: 'string', description: 'e.g. 01, 02, 03' }),
            defineField({ name: 'image', title: 'Background Image (Sanity asset)', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageUrl', title: 'Background Image URL (external fallback)', type: 'url' }),
            defineField({ name: 'link', title: 'Link', type: 'string', initialValue: '/courses' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'number' },
          },
        },
      ],
    }),

    // ─── Newsletter Section ──────────────────────────────────────────
    defineField({
      name: 'newsletterTitle',
      title: 'Newsletter Banner — Heading',
      type: 'string',
      description: 'Title for the email subscription banner shown at the bottom of the page.',
      initialValue: 'Stay Updated with Our Latest Training Programs',
    }),
    defineField({
      name: 'newsletterDescription',
      title: 'Newsletter Banner — Description',
      type: 'text',
      rows: 2,
      description: 'Sub-text below the newsletter heading.',
      initialValue: 'Get notified about new training programs, special offers, and educational content',
    }),

    // ─── Bottom Banner / CTA Section ────────────────────────────────
    defineField({
      name: 'bannerTitle',
      title: 'Banner — Heading',
      type: 'string',
      initialValue: 'Start Your Preparation Today.',
    }),
    defineField({
      name: 'bannerDescription',
      title: 'Banner — Description',
      type: 'text',
      rows: 2,
      initialValue: 'Access premium study materials and take the first step towards your dream career in forensic science.',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner — Background Image (Sanity asset)',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a background image for the dark banner section (preferred over URL).',
    }),
    defineField({
      name: 'bannerImageUrl',
      title: 'Banner — Background Image URL (external fallback)',
      type: 'url',
      description: 'Used only if no Sanity image is uploaded above.',
    }),
    defineField({
      name: 'bannerCta1Text',
      title: 'Banner — CTA Button 1 Text',
      type: 'string',
      initialValue: 'View Study Materials',
    }),
    defineField({
      name: 'bannerCta1Link',
      title: 'Banner — CTA Button 1 Link',
      type: 'string',
      initialValue: '/study-material',
    }),
    defineField({
      name: 'bannerCta2Text',
      title: 'Banner — CTA Link 2 Text',
      type: 'string',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'bannerCta2Link',
      title: 'Banner — CTA Link 2 URL',
      type: 'string',
      initialValue: '/contact',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
