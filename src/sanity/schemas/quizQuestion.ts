import { defineField, defineType } from 'sanity'

export const quizQuestion = defineType({
  name: 'quizQuestion',
  title: 'Quiz Question',
  type: 'document',
  fields: [
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'reference',
      to: [{ type: 'subject' }],
      description: 'The subject this question belongs to.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Answer Options',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: 'correctAnswer',
      title: 'Correct Answer Index',
      type: 'number',
      description: 'Zero-based index of the correct option (0 = first, 1 = second, etc.)',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'resourceFile',
      title: 'Attached Resource (PDF/Image)',
      type: 'file',
      description: 'Optional: Attach an image, PDF, or document related to this question.',
      options: { accept: '.pdf,.png,.jpg,.jpeg,.doc,.docx' },
    }),
    defineField({
      name: 'resourceLink',
      title: 'Reference Link',
      type: 'url',
      description: 'Optional: A link to reference material for this question.',
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
      title: 'question',
      subtitle: 'subject.name',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Question',
        subtitle: subtitle ? `Subject: ${subtitle}` : 'No subject assigned',
      }
    },
  },
})
