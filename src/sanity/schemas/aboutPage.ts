import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    // Hero
    defineField({
      name: 'heroTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About Beyond Evidence',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Page Description',
      type: 'text',
      rows: 2,
      initialValue: 'Bridging the gap between theoretical forensic science and real-world investigation through premier education.',
    }),

    // Mission Section
    defineField({
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'string',
      initialValue: 'Decoding the Truth, Empowering Minds.',
    }),
    defineField({
      name: 'missionBody',
      title: 'Mission Body Text',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'missionBodySimple',
      title: 'Mission Body (Simple Text)',
      type: 'text',
      rows: 5,
      description: 'Simple text version of mission body. Used if rich text is empty.',
      initialValue: 'Beyond Evidence prioritizes clarity and structured discovery. We move away from dense, unstructured textbooks and toward interactive evidence mapping, making complex forensic concepts accessible and engaging.\n\nOur platform is designed for students preparing for crucial exams, researchers developing new methodologies, and enthusiasts passionate about the pursuit of truth through science.',
    }),
    defineField({
      name: 'missionImage',
      title: 'Mission Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'missionImageUrl',
      title: 'Mission Image URL (external)',
      type: 'url',
    }),

    // Methodology Section
    defineField({
      name: 'methodologyTitle',
      title: 'Methodology Section Title',
      type: 'string',
      initialValue: 'Our Methodology',
    }),
    defineField({
      name: 'methodologyDescription',
      title: 'Methodology Section Description',
      type: 'text',
      rows: 2,
      initialValue: 'We focus on high-yield topics, practical skill drills, and interconnected learning to ensure mastery of forensic sciences.',
    }),
    defineField({
      name: 'methodologyFeatures',
      title: 'Methodology Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'iconName', title: 'Icon Name', type: 'string', description: 'lucide-react icon: BookOpen, Compass, Target, Users' }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
