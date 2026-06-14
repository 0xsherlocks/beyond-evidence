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
      initialValue: 'Decode the Unseen.',
    }),
    defineField({
      name: 'heroTitleLine2',
      title: 'Hero Title (Line 2 - lighter color)',
      type: 'string',
      initialValue: 'Master Intelligence.',
    }),
    defineField({
      name: 'heroHighlight',
      title: 'Hero Highlight Text (bold)',
      type: 'string',
      initialValue: 'Proving everything with forensic science.',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      initialValue: 'Empowering students and professionals with top-tier customized courses, expert guidance, and comprehensive learning resources to excel in the field.',
    }),

    // Value Proposition Section
    defineField({
      name: 'valuePropEyebrow',
      title: 'Value Prop Section Eyebrow',
      type: 'string',
      initialValue: 'The Curriculum',
    }),
    defineField({
      name: 'valuePropTitle',
      title: 'Value Prop Section Title',
      type: 'string',
      initialValue: 'Structured for Discovery',
    }),
    defineField({
      name: 'valueProps',
      title: 'Value Proposition Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'iconName', title: 'Icon Name', type: 'string', description: 'lucide-react icon name: BookOpen, Microscope, BookCheck' }),
            defineField({ name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageUrl', title: 'Image URL (external)', type: 'url' }),
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
      initialValue: 'Interactive Index',
    }),
    defineField({
      name: 'featuredTopicsTitle',
      title: 'Featured Topics Title',
      type: 'string',
      initialValue: 'Explore the Disciplines',
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
            defineField({ name: 'link', title: 'Link', type: 'string', initialValue: '/topics' }),
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
      initialValue: 'Accelerate the Intelligence Cycle.',
    }),
    defineField({
      name: 'bannerDescription',
      title: 'Banner Description',
      type: 'text',
      rows: 2,
      initialValue: 'Join a network of academic researchers and investigators contributing to our peer-reviewed knowledge base.',
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
      initialValue: 'Join the Network',
    }),
    defineField({
      name: 'bannerCta1Link',
      title: 'Banner CTA 1 Link',
      type: 'string',
      initialValue: '/studio',
    }),
    defineField({
      name: 'bannerCta2Text',
      title: 'Banner CTA 2 Text',
      type: 'string',
      initialValue: 'Contact Board',
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
