import { defineField, defineType } from 'sanity'

const resourceCardFields = [
  defineField({ name: 'name', title: 'Name', type: 'string' }),
  defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  defineField({ name: 'url', title: 'External URL', type: 'url' }),
  defineField({
    name: 'logo',
    title: 'Logo (Upload Image)',
    type: 'image',
    description: 'Upload the tool logo directly. This takes priority over the URL field below.',
    options: { hotspot: false },
  }),
  defineField({ name: 'imageUrl', title: 'Logo URL (fallback)', type: 'url', description: 'Paste a direct link to the logo if you prefer not to upload.' }),
  defineField({ name: 'color', title: 'Accent Color Hex', type: 'string', description: 'Used as background if no logo is set, e.g. #4285F4' }),
]

export const researchPage = defineType({
  name: 'researchPage',
  title: 'Research Page',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'roadmap', title: 'Research Roadmap' },
    { name: 'papers', title: 'Find Research Papers' },
    { name: 'forensic', title: 'Forensic Science Resources' },
    { name: 'ai', title: 'AI Tools' },
    { name: 'refmgr', title: 'Reference Management' },
    { name: 'citation', title: 'Citation Generators' },
    { name: 'writing', title: 'Writing Guides' },
    { name: 'templates', title: 'Templates' },
    { name: 'mentorship', title: 'Mentorship CTA' },
  ],
  fields: [
    // ── Hero ──
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', fieldset: 'hero', initialValue: 'Research' }),
    defineField({ name: 'heroSubtitle', title: 'Subtitle', type: 'text', rows: 2, fieldset: 'hero', initialValue: 'Everything students need to find, read, organize, write, and publish research papers.' }),

    // ── Roadmap ──
    defineField({ name: 'roadmapTitle', title: 'Section Title', type: 'string', fieldset: 'roadmap', initialValue: 'Research Roadmap' }),
    defineField({ name: 'roadmapDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'roadmap' }),
    defineField({ name: 'roadmapImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'roadmap' }),
    defineField({ name: 'roadmapImageUrl', title: 'External Image URL', type: 'url', fieldset: 'roadmap' }),
    defineField({
      name: 'roadmapSteps', title: 'Steps', type: 'array', fieldset: 'roadmap',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Step Title', type: 'string' }),
          defineField({ name: 'description', title: 'Short Explanation', type: 'text', rows: 2 }),
          defineField({ name: 'iconName', title: 'Lucide Icon Name', type: 'string' }),
          defineField({ name: 'link', title: 'Resource Link', type: 'string' }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── Paper Databases ──
    defineField({ name: 'paperDbTitle', title: 'Section Title', type: 'string', fieldset: 'papers', initialValue: 'Find Research Papers' }),
    defineField({ name: 'paperDbDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'papers' }),
    defineField({ name: 'paperDbImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'papers' }),
    defineField({ name: 'paperDbImageUrl', title: 'External Image URL', type: 'url', fieldset: 'papers' }),
    defineField({
      name: 'paperDatabases', title: 'Databases', type: 'array', fieldset: 'papers',
      of: [{ type: 'object', fields: resourceCardFields, preview: { select: { title: 'name', subtitle: 'description' } } }],
    }),

    // ── Forensic Resources ──
    defineField({ name: 'forensicTitle', title: 'Section Title', type: 'string', fieldset: 'forensic', initialValue: 'Forensic Science Resources' }),
    defineField({ name: 'forensicDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'forensic' }),
    defineField({ name: 'forensicImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'forensic' }),
    defineField({ name: 'forensicImageUrl', title: 'External Image URL', type: 'url', fieldset: 'forensic' }),
    defineField({
      name: 'forensicResources', title: 'Resources', type: 'array', fieldset: 'forensic',
      of: [{ type: 'object', fields: resourceCardFields, preview: { select: { title: 'name', subtitle: 'description' } } }],
    }),

    // ── AI Tools ──
    defineField({ name: 'aiToolsTitle', title: 'Section Title', type: 'string', fieldset: 'ai', initialValue: 'AI Tools for Research' }),
    defineField({ name: 'aiToolsDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'ai' }),
    defineField({ name: 'aiToolsImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'ai' }),
    defineField({ name: 'aiToolsImageUrl', title: 'External Image URL', type: 'url', fieldset: 'ai' }),
    defineField({
      name: 'aiTools', title: 'Tools', type: 'array', fieldset: 'ai',
      of: [{ type: 'object', fields: resourceCardFields, preview: { select: { title: 'name', subtitle: 'description' } } }],
    }),

    // ── Reference Managers ──
    defineField({ name: 'refManagerTitle', title: 'Section Title', type: 'string', fieldset: 'refmgr', initialValue: 'Reference Management' }),
    defineField({ name: 'refManagerDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'refmgr' }),
    defineField({ name: 'refManagerImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'refmgr' }),
    defineField({ name: 'refManagerImageUrl', title: 'External Image URL', type: 'url', fieldset: 'refmgr' }),
    defineField({
      name: 'referenceManagers', title: 'Tools', type: 'array', fieldset: 'refmgr',
      of: [{ type: 'object', fields: resourceCardFields, preview: { select: { title: 'name', subtitle: 'description' } } }],
    }),

    // ── Citation Generators ──
    defineField({ name: 'citationTitle', title: 'Section Title', type: 'string', fieldset: 'citation', initialValue: 'Citation Generators' }),
    defineField({ name: 'citationDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'citation' }),
    defineField({ name: 'citationImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'citation' }),
    defineField({ name: 'citationImageUrl', title: 'External Image URL', type: 'url', fieldset: 'citation' }),
    defineField({
      name: 'citationGenerators', title: 'Generators', type: 'array', fieldset: 'citation',
      of: [{
        type: 'object',
        fields: [
          ...resourceCardFields,
          defineField({ name: 'formats', title: 'Supported Formats', type: 'array', of: [{ type: 'string' }], description: 'APA, MLA, Chicago, Harvard' }),
        ],
        preview: { select: { title: 'name' } },
      }],
    }),

    // ── Writing Guides ──
    defineField({ name: 'writingGuideTitle', title: 'Section Title', type: 'string', fieldset: 'writing', initialValue: 'Research Writing Guides' }),
    defineField({ name: 'writingGuideDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'writing' }),
    defineField({ name: 'writingGuideImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'writing' }),
    defineField({ name: 'writingGuideImageUrl', title: 'External Image URL', type: 'url', fieldset: 'writing' }),
    defineField({
      name: 'writingGuides', title: 'Guides', type: 'array', fieldset: 'writing',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'heading', title: 'Section Name', type: 'string' }),
          defineField({ name: 'explanation', title: 'Explanation', type: 'text', rows: 4 }),
          defineField({ name: 'tips', title: 'Tips', type: 'array', of: [{ type: 'string' }] }),
          defineField({ name: 'mistakes', title: 'Common Mistakes', type: 'array', of: [{ type: 'string' }] }),
        ],
        preview: { select: { title: 'heading' } },
      }],
    }),

    // ── Templates ──
    defineField({ name: 'templatesTitle', title: 'Section Title', type: 'string', fieldset: 'templates', initialValue: 'Downloadable Templates' }),
    defineField({ name: 'templatesDescription', title: 'Section Description', type: 'text', rows: 2, fieldset: 'templates' }),
    defineField({ name: 'templatesImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'templates' }),
    defineField({ name: 'templatesImageUrl', title: 'External Image URL', type: 'url', fieldset: 'templates' }),
    defineField({
      name: 'templates', title: 'Templates', type: 'array', fieldset: 'templates',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          defineField({ name: 'downloadUrl', title: 'Download URL', type: 'url' }),
          defineField({ name: 'iconName', title: 'Icon Name', type: 'string' }),
        ],
        preview: { select: { title: 'name' } },
      }],
    }),

    // ── Mentorship ──
    defineField({ name: 'mentorshipTitle', title: 'Title', type: 'string', fieldset: 'mentorship', initialValue: 'Need Research Guidance?' }),
    defineField({ name: 'mentorshipDescription', title: 'Description', type: 'text', rows: 3, fieldset: 'mentorship', initialValue: 'Our mentors can guide you through topic selection, literature review, paper writing, and journal submission. Book a one-on-one session.' }),
    defineField({ name: 'mentorshipImage', title: 'Section Image', type: 'image', options: { hotspot: true }, fieldset: 'mentorship' }),
    defineField({ name: 'mentorshipImageUrl', title: 'External Image URL', type: 'url', fieldset: 'mentorship' }),
    defineField({ name: 'mentorshipEmail', title: 'Email', type: 'string', fieldset: 'mentorship', initialValue: 'beyondevidence7@gmail.com' }),
    defineField({ name: 'mentorshipPhone', title: 'Phone', type: 'string', fieldset: 'mentorship', initialValue: '8429492976' }),
    defineField({ name: 'mentorshipCtaText', title: 'CTA Button Text', type: 'string', fieldset: 'mentorship', initialValue: 'Book a Mentorship Session' }),
    defineField({ name: 'mentorshipCtaLink', title: 'CTA Link', type: 'string', fieldset: 'mentorship', initialValue: '/contact' }),
  ],
  preview: { prepare() { return { title: 'Research Page' } } },
})
