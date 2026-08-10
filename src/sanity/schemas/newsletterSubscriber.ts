import { defineType, defineField } from 'sanity'

export const newsletterSubscriber = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Subscribed', value: 'subscribed' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
        ],
      },
      initialValue: 'subscribed',
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'subscribedAt',
    },
  },
})
