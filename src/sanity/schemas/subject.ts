import { defineField, defineType } from 'sanity'

export const subject = defineType({
  name: 'subject',
  title: 'Subject',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Subject Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (external)',
      type: 'url',
      description: 'Use this if you want to use an external image URL instead of uploading.',
    }),
    defineField({
      name: 'modules',
      title: 'Modules / Slides',
      type: 'array',
      description: 'Upload lecture slides, notes, or link to external resources for this subject.',
      of: [
        {
          type: 'object',
          name: 'module',
          title: 'Module',
          fields: [
            defineField({ name: 'title', title: 'Module Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'file',
              title: 'Upload File (PDF/PPT/Slides)',
              type: 'file',
              options: { accept: '.pdf,.ppt,.pptx,.doc,.docx,.zip' },
            }),
            defineField({
              name: 'link',
              title: 'External Link',
              type: 'url',
              description: 'Link to Google Slides, Google Drive, or any external resource.',
            }),
            defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
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
      title: 'name',
      subtitle: 'description',
      media: 'image',
    },
  },
})
