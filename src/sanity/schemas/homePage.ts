import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'heroTitle',
      title: 'Hero Title (Line 1)',
      type: 'string',
      initialValue: 'Master Forensic Science.',
    }),
    defineField({
      name: 'heroTitleLine2',
      title: 'Hero Title (Line 2 - lighter color)',
      type: 'string',
      initialValue: 'Achieve Your Goals.',
    }),
    defineField({
      name: 'heroHighlight',
      title: 'Hero Highlight Text (bold)',
      type: 'string',
      initialValue: 'Your ultimate destination for UGC NET JRF preparation.',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      initialValue: 'Empowering students with expert-curated study materials, mock tests, and comprehensive guidance to excel in forensic science examinations.',
    }),

    // Value Proposition Section
    defineField({
      name: 'valuePropEyebrow',
      title: 'Value Prop Section Eyebrow',
      type: 'string',
      initialValue: 'Our Features',
    }),
    defineField({
      name: 'valuePropTitle',
      title: 'Value Prop Section Title',
      type: 'string',
      initialValue: 'Why Choose Beyond Evidence?',
    }),
    defineField({
      name: 'valueProps',
      title: 'Value Proposition Cards',
      type: 'array',
      initialValue: [
        { title: 'Live Job Alerts', description: 'Get the latest updates on forensic vacancies, internships, and government exams delivered instantly.', iconName: 'BellRing', link: '/notification' },
        { title: 'Mock Tests', description: 'Test your preparation with high-quality, exam-pattern question sets and detailed performance analytics.', iconName: 'BookCheck', link: '/quiz' },
        { title: 'UGC NET Focused', description: 'Premium study material perfectly aligned with the latest NTA UGC NET syllabus for Forensic Science.', iconName: 'Target', link: '/study-material/ugc-net-jrf' },
      ],
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'iconName', title: 'Icon Name', type: 'string', description: 'lucide-react icon name: BookOpen, Microscope, BookCheck' }),
            defineField({ name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageUrl', title: 'Image URL (external)', type: 'url' }),
            defineField({ name: 'link', title: 'Link (optional)', type: 'string', description: 'e.g. /study-material or /contact' }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),

    // Featured Topics Section
    defineField({
      name: 'featuredTopicsEyebrow',
      title: 'Featured Topics Eyebrow',
      type: 'string',
      initialValue: 'Explore Subjects',
    }),
    defineField({
      name: 'featuredTopicsTitle',
      title: 'Featured Topics Title',
      type: 'string',
      initialValue: 'Browse the Syllabus',
    }),
    defineField({
      name: 'featuredTopics',
      title: 'Featured Topic Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'number', title: 'Display Number', type: 'string', description: 'e.g. 01, 02' }),
            defineField({ name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageUrl', title: 'Image URL (external)', type: 'url' }),
            defineField({ name: 'link', title: 'Link', type: 'string', initialValue: '/syllabus' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'number' },
          },
        },
      ],
    }),

    // Banner Section
    defineField({
      name: 'bannerTitle',
      title: 'Banner Title',
      type: 'string',
      initialValue: 'Start Your Preparation Today.',
    }),
    defineField({
      name: 'bannerDescription',
      title: 'Banner Description',
      type: 'text',
      rows: 2,
      initialValue: 'Access premium study materials and take the first step towards your dream career in forensic science.',
    }),
    defineField({
      name: 'bannerImageUrl',
      title: 'Banner Background Image URL',
      type: 'url',
    }),
    defineField({
      name: 'bannerCta1Text',
      title: 'Banner CTA 1 Text',
      type: 'string',
      initialValue: 'View Study Materials',
    }),
    defineField({
      name: 'bannerCta1Link',
      title: 'Banner CTA 1 Link',
      type: 'string',
      initialValue: '/study-material',
    }),
    defineField({
      name: 'bannerCta2Text',
      title: 'Banner CTA 2 Text',
      type: 'string',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'bannerCta2Link',
      title: 'Banner CTA 2 Link',
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
