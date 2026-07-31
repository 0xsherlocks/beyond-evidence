import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const query = '*[_type == "studyMaterial"] | order(order asc){title, "slug": slug.current}'

for (const [projectId, token] of [
  ['zm4dl3vf public', undefined],
  ['zm4dl3vf token', process.env.SANITY_API_TOKEN],
  ['tihvclm6 public', undefined],
]) {
  const client = createClient({
    projectId: projectId.split(' ')[0],
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })

  try {
    const docs = await client.fetch(query)
    console.log(projectId, docs.length, docs)
  } catch (error) {
    console.log(projectId, 'ERROR', error.message)
  }
}
