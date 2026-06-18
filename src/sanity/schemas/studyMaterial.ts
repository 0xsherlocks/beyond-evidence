import { defineField, defineType } from 'sanity'

export const studyMaterial = defineType({
  name: 'studyMaterial',
  title: 'Study Material',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., UGC NET JRF, Fact & fact Plus, JSA, SSA, SSO',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'introParagraphs',
      title: 'Intro Letter Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      description: 'Add paragraphs for the introductory letter to students.',
    }),
    defineField({
      name: 'features',
      title: 'What You Will Get (Features)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ 
              name: 'iconName', 
              title: 'Icon Name', 
              type: 'string',
              description: 'e.g., BookOpen, ClipboardList, FileText' 
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'packages',
      title: 'Pricing Packages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'Package ID', type: 'string', description: 'e.g., notes, mock, combo' }),
            defineField({ name: 'title', title: 'Package Title', type: 'string' }),
            defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
            defineField({ name: 'price', title: 'Price String', type: 'string', description: 'e.g., ₹999' }),
            defineField({ name: 'badge', title: 'Badge', type: 'string', description: 'e.g., BEST VALUE (optional)' }),
            defineField({
              name: 'featuresList',
              title: 'Features List',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
