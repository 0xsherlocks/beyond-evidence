'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/src/sanity/schemas'
import { structure } from '@/src/sanity/structure'

export default defineConfig({
  name: 'beyond-evidence',
  title: 'Beyond Evidence',

  projectId: 'tihvclm6',
  dataset: 'production',
  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
