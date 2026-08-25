import { defineField, defineType } from 'sanity'

export const premiumCourse = defineType({
  name: 'premiumCourse',
  title: 'Premium Course',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      description: 'e.g., UGC NET JRF Forensic Science Complete Notes',
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
      name: 'examType',
      title: 'Exam Type',
      type: 'string',
      options: {
        list: [
          { title: 'UGC NET', value: 'UGC NET' },
          { title: 'UPSC', value: 'UPSC' },
          { title: 'SSC', value: 'SSC' },
          { title: 'GATE', value: 'GATE' },
          { title: 'State PSC', value: 'State PSC' },
          { title: 'Other', value: 'Other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      description: 'Price in INR. Used for display and payment.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isPremium',
      title: 'Is Premium',
      type: 'boolean',
      description: 'Always true for premium notes. Controls access gating.',
      initialValue: true,
    }),
    defineField({
      name: 'units',
      title: 'Units / Chapters',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'unit',
          title: 'Unit',
          fields: [
            defineField({
              name: 'unitTitle',
              title: 'Unit Title',
              type: 'string',
              description: 'e.g., Unit 1: Forensic Science Fundamentals',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Content (Portable Text)',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'Heading 1', value: 'h1' },
                    { title: 'Heading 2', value: 'h2' },
                    { title: 'Heading 3', value: 'h3' },
                    { title: 'Quote', value: 'blockquote' },
                  ],
                  lists: [
                    { title: 'Bullet', value: 'bullet' },
                    { title: 'Numbered', value: 'number' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Bold', value: 'strong' },
                      { title: 'Italic', value: 'em' },
                      { title: 'Underline', value: 'underline' },
                      { title: 'Highlight', value: 'highlight' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          defineField({ name: 'href', title: 'URL', type: 'url' }),
                        ],
                      },
                    ],
                  },
                },
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'unitTitle' },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Exam Type',
      name: 'examTypeAsc',
      by: [{ field: 'examType', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'examType',
      media: 'thumbnail',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Course',
        subtitle: subtitle || '',
        media,
      }
    },
  },
})
