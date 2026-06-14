import { defineField, defineType } from 'sanity'

export const researchArticle = defineType({
  name: 'researchArticle',
  title: 'Research Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'tag',
      title: 'Category Tag',
      type: 'string',
      description: 'e.g. Journal Roundup, SOP, Case Library',
      options: {
        list: [
          { title: 'Journal Roundup', value: 'Journal Roundup' },
          { title: 'SOP', value: 'SOP' },
          { title: 'Case Library', value: 'Case Library' },
          { title: 'Review', value: 'Review' },
          { title: 'Tutorial', value: 'Tutorial' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Lead Investigator / Author',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'date',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (external)',
      type: 'url',
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      of: [{ type: 'block' }],
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
      title: 'Publication Date',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tag',
      media: 'image',
    },
  },
})
