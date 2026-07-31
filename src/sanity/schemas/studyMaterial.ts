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
      description: 'e.g., UGC NET JRF, FACT and FACT Plus, JSA, SSA, SSO',
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
      name: 'iconName',
      title: 'Card Icon Name',
      type: 'string',
      description: 'Lucide icon name used on the listing card. Examples: BookOpen, ClipboardList, FileText, Target, Sparkles.',
      initialValue: 'BookOpen',
    }),
    defineField({
      name: 'image',
      title: 'Hero/Card Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional Sanity image used as the page hero background and listing card image.',
    }),
    defineField({
      name: 'imageUrl',
      title: 'External Image URL',
      type: 'url',
      description: 'Optional external image URL. Used if no Sanity image is selected.',
    }),
    defineField({
      name: 'introParagraphs',
      title: 'Intro / Note Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      description: 'Add paragraphs for the introductory note shown on the study material page.',
    }),
    defineField({
      name: 'features',
      title: 'What You Will Get',
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
              description: 'Lucide icon name. Examples: BookOpen, ClipboardList, FileText, Target, Sparkles.',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
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
            defineField({ name: 'id', title: 'Package ID', type: 'string', description: 'Stable ID used by checkout. Examples: notes, mock, combo.' }),
            defineField({ name: 'title', title: 'Package Title', type: 'string' }),
            defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
            defineField({ name: 'price', title: 'Price Display String', type: 'string', description: 'Display text, e.g. Rs. 999 or INR 999.' }),
            defineField({
              name: 'priceAmount',
              title: 'Price Amount',
              type: 'number',
              description: 'Numeric price in rupees. Used by payment/order creation; do not include currency symbols.',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({ name: 'badge', title: 'Badge', type: 'string', description: 'Optional label, e.g. BEST VALUE.' }),
            defineField({
              name: 'featuresList',
              title: 'Features List',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'downloadLinks',
              title: 'Paid Download Links',
              type: 'array',
              description: 'Links shown only after a paid purchase is verified for this package.',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'title', title: 'Title', type: 'string' }),
                    defineField({ name: 'url', title: 'URL', type: 'url' }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'url',
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              price: 'price',
            },
            prepare({ title, subtitle, price }) {
              return {
                title: title || 'Untitled package',
                subtitle: [subtitle, price].filter(Boolean).join(' - '),
              }
            },
          },
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
