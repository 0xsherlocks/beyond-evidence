import { defineField, defineType } from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Legal Information',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Page Description',
      type: 'string',
      initialValue: 'Terms of Service, Privacy Policy, and Disclaimers.',
    }),
    defineField({
      name: 'sections',
      title: 'Legal Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
            defineField({
              name: 'content',
              title: 'Section Content',
              type: 'array',
              of: [{ type: 'block' }],
            }),
            defineField({
              name: 'contentSimple',
              title: 'Section Content (Simple Text)',
              type: 'text',
              rows: 6,
              description: 'Simple text fallback if rich text is empty.',
            }),
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email (for legal queries)',
      type: 'string',
      initialValue: 'beyondevidence7@gmail.com',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Legal Page' }
    },
  },
})
