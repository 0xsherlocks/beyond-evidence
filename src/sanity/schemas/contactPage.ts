import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    // Hero
    defineField({
      name: 'heroTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Get in Touch',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Page Description',
      type: 'text',
      rows: 2,
      initialValue: 'Call or email to book an appointment, seek student guidance, or collaborate on forensic modules.',
    }),
    defineField({
      name: 'contactDescription',
      title: 'Contact Section Description',
      type: 'text',
      rows: 4,
      initialValue: "Whether you're a student seeking academic support, preparing for UGC-NET, or a professional looking to collaborate on forensic research, we are here for you. Schedule an appointment or reach out with inquiries directly via phone or email.",
    }),

    // Contact Info
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      initialValue: '8429492976',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      initialValue: 'beyondevidence7@gmail.com',
    }),

    // Social Links
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string', options: {
              list: [
                { title: 'WhatsApp', value: 'whatsapp' },
                { title: 'Instagram', value: 'instagram' },
                { title: 'LinkedIn', value: 'linkedin' },
                { title: 'Twitter / X', value: 'twitter' },
                { title: 'YouTube', value: 'youtube' },
                { title: 'Facebook', value: 'facebook' },
              ],
            }}),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
            defineField({ name: 'label', title: 'Display Label', type: 'string' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),

    // Business Hours
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Days', type: 'string' }),
            defineField({ name: 'hours', title: 'Hours', type: 'string' }),
          ],
          preview: {
            select: { title: 'days', subtitle: 'hours' },
          },
        },
      ],
    }),
    defineField({
      name: 'closedNote',
      title: 'Closed Day Note',
      type: 'string',
      initialValue: 'Closed on Sundays',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact Page' }
    },
  },
})
