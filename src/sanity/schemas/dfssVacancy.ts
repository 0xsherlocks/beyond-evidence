import { defineField, defineType } from 'sanity'

export const dfssVacancy = defineType({
  name: 'dfssVacancy',
  title: 'DFSS Vacancy',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Vacancy Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Vacancy Date',
      type: 'string',
      description: 'Date as listed on the DFSS website',
    }),
    defineField({
      name: 'notificationUrl',
      title: 'PDF / Notification URL',
      type: 'url',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source Page URL',
      type: 'url',
      initialValue: 'https://dfs.nic.in/vacancy.html',
    }),
    defineField({
      name: 'scrapedAt',
      title: 'Scraped At',
      type: 'datetime',
    }),
    defineField({
      name: 'fingerprint',
      title: 'Dedup Fingerprint',
      type: 'string',
      description: 'Auto-generated hash for deduplication. Do not edit.',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Scraped Date (Newest)',
      name: 'scrapedDesc',
      by: [{ field: 'scrapedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
  },
})
