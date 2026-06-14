import { defineField, defineType } from 'sanity'

export const notification = defineType({
  name: 'notification',
  title: 'Notification',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isNew',
      title: 'Is New (show pulse indicator)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp Label',
      type: 'string',
      description: 'e.g. "Just now", "2 hours ago", "Coming soon"',
      initialValue: 'Just now',
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
      subtitle: 'timestamp',
    },
  },
})
