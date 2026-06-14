import { defineField, defineType } from 'sanity'

export const quizQuestion = defineType({
  name: 'quizQuestion',
  title: 'Quiz Question',
  type: 'document',
  fields: [
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
    },
  },
})
