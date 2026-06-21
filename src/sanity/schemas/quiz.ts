import { defineField, defineType } from 'sanity'

export const quiz = defineType({
  name: 'quiz',
  title: 'Quiz',
  type: 'document',
  fields: [
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'reference',
      to: [{ type: 'subject' }],
      description: 'The subject this quiz belongs to.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quizQuestions',
      title: 'Quiz Questions',
      type: 'array',
      description: 'Add multiple choice questions for this subject.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ 
              name: 'options', 
              title: 'Answer Options', 
              type: 'array', 
              of: [{ type: 'string' }], 
              validation: (Rule) => Rule.min(2).max(6) 
            }),
            defineField({ 
              name: 'correctAnswer', 
              title: 'Correct Answer Index', 
              type: 'number', 
              description: 'Zero-based index of the correct option (0 = first option, 1 = second, etc.)',
              validation: (Rule) => Rule.required().min(0) 
            }),
            defineField({
              name: 'explanation',
              title: 'Explanation (Optional)',
              description: 'Explain why this answer is correct.',
              type: 'text'
            }),
          ],
          preview: {
            select: { title: 'question' }
          }
        }
      ]
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
      title: 'subject.name',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ? `Quiz: ${title}` : 'Untitled Quiz',
      }
    }
  },
})
