import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'headerLinks',
      title: 'Header Navigation Links',
      description: 'Add, remove, or reorder nav links here. Changes appear in the header immediately. The "Home" link (/) is always added automatically.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'Text shown in the navbar. e.g. "Courses"' }),
            defineField({ name: 'href', title: 'URL Path', type: 'string', description: 'Page URL. e.g. /courses, /research, /my-new-page' }),
            defineField({
              name: 'isVisible',
              title: 'Visible in Header',
              type: 'boolean',
              description: 'Uncheck to hide this link from the navbar without deleting it.',
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href', isVisible: 'isVisible' },
            prepare({ title, subtitle, isVisible }: { title?: string; subtitle?: string; isVisible?: boolean }) {
              return {
                title: `${isVisible === false ? '🙈 ' : ''}${title || 'Untitled'}`,
                subtitle: subtitle || '',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Navigation Links',
      description: 'Links shown in the footer bottom bar.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'href', title: 'URL Path', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
