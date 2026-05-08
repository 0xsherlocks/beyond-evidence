import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

/**
 * Example function to fetch topics from Sanity
 */
export async function getTopics() {
  return await sanityClient.fetch(`*[_type == "topic"]{
    _id,
    name,
    description,
    "count": count(*[_type == "article" && references(^._id)]),
    icon
  }`);
}
