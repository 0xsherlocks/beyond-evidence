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
      description: 'Manage sources for the daily database sync. Changes take effect on the next cron run.',
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
              description: 'Shown as the source label. Leave blank to use the feed title.',
            },
            {
              name: 'category',
              title: 'Category Override (Optional)',
              type: 'string',
              options: {
                list: [
                  { title: 'Automatic', value: 'automatic' },
                  { title: 'Jobs', value: 'job' },
                  { title: 'Internships', value: 'internship' },
                  { title: 'Exams', value: 'exam' },
                  { title: 'Scholarships', value: 'scholarship' },
                  { title: 'Workshops', value: 'workshop' },
                  { title: 'Conferences', value: 'conference' },
                  { title: 'Other', value: 'other' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'automatic',
              description: 'Use Automatic to classify each item from its title.',
            },
            {
              name: 'enabled',
              title: 'Enable this feed',
              type: 'boolean',
              initialValue: true,
            },
          ]
        }
      ]
    }),
  ],
})
