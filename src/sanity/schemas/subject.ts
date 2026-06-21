import { defineField, defineType } from 'sanity'

export const subject = defineType({
  name: 'subject',
  title: 'Subject',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Subject Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (external)',
      type: 'url',
      description: 'Use this if you want to use an external image URL instead of uploading.',
    }),
    defineField({
      name: 'modules',
      title: 'Modules / Slides',
      type: 'array',
      description: 'Upload lecture slides, notes, or link to external resources for this subject.',
      of: [
        {
          type: 'object',
          name: 'module',
          title: 'Module',
          fields: [
            defineField({ name: 'title', title: 'Module Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 2 }),
            defineField({
              name: 'content',
              title: 'Lesson Content (Rich Text)',
              type: 'array',
              description: 'Copy-paste your lesson text here. Supports headings, bold, italic, lists, and images.',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'H2', value: 'h2' },
                    { title: 'H3', value: 'h3' },
                    { title: 'H4', value: 'h4' },
                    { title: 'Quote', value: 'blockquote' },
                  ],
                  lists: [
                    { title: 'Bullet', value: 'bullet' },
                    { title: 'Numbered', value: 'number' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Bold', value: 'strong' },
                      { title: 'Italic', value: 'em' },
                      { title: 'Underline', value: 'underline' },
                      { title: 'Highlight', value: 'highlight' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          { name: 'href', type: 'url', title: 'URL' },
                        ],
                      },
                    ],
                  },
                },
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    { name: 'caption', type: 'string', title: 'Caption' },
                    { name: 'alt', type: 'string', title: 'Alt Text' },
                    {
                      name: 'size',
                      type: 'string',
                      title: 'Image Size',
                      options: { 
                        list: [
                          { title: 'Small', value: 'small' },
                          { title: 'Medium', value: 'medium' },
                          { title: 'Large', value: 'large' },
                          { title: 'Full Width', value: 'full' }
                        ],
                        layout: 'radio'
                      },
                      initialValue: 'full'
                    },
                    {
                      name: 'position',
                      type: 'string',
                      title: 'Alignment',
                      options: { 
                        list: [
                          { title: 'Left (Text wraps around)', value: 'left' },
                          { title: 'Center', value: 'center' },
                          { title: 'Right (Text wraps around)', value: 'right' }
                        ],
                        layout: 'radio'
                      },
                      initialValue: 'center'
                    }
                  ],
                },
              ],
            }),
            defineField({
              name: 'file',
              title: 'Upload File (Optional Fallback)',
              type: 'file',
              description: 'Only use if you cannot paste text above. PDF/PPT/Word files.',
              options: { accept: '.pdf,.ppt,.pptx,.doc,.docx,.zip' },
            }),
            defineField({
              name: 'link',
              title: 'External Link (Optional)',
              type: 'url',
              description: 'Link to Google Slides, Google Drive, or any external resource.',
            }),
            defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
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
      title: 'name',
      subtitle: 'description',
      media: 'image',
    },
  },
})
