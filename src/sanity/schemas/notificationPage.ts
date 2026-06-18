import { defineField, defineType } from 'sanity'

export const notificationPage = defineType({
  name: 'notificationPage',
  title: 'Notification Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Updates & Alerts',
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      rows: 3,
      initialValue: 'Stay updated with the latest announcements, job vacancies, and important updates from Beyond Evidence and around the forensic network.',
    }),
    defineField({
      name: 'rssFeeds',
      title: 'RSS Feed URLs',
      type: 'array',
      description: 'Add RSS feed URLs here. They will be automatically fetched and displayed on the notifications page.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'RSS URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'sourceName',
              title: 'Custom Source Name (Optional)',
              type: 'string',
              description: 'Leave blank to try and auto-detect from the URL or feed title.',
            }
          ]
        }
      ]
    }),
  ],
})
