import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const materials = [
  {
    title: 'UGC NET JRF - Forensic Science Study Material',
    slug: 'ugc-net-jrf',
    description: 'Complete notes for all 10 units and a mock test series curated as per the latest UGC NET/JRF courses.',
    iconName: 'BookOpen',
    order: 1,
    introParagraphs: [
      'Dear Student,',
      'Greetings! Thank you for showing interest in the UGC NET JRF - Forensic Science study material.',
      'To support your preparation, I have curated high-quality, updated, and exam-focused study resources designed as per the latest NET/JRF courses. These materials are built to help you revise efficiently and perform confidently on exam day.',
    ],
    features: [
      { title: 'Complete Notes - All 10 Units', description: 'Clear, structured, and exam-focused notes covering every topic in the courses.', iconName: 'BookOpen' },
      { title: 'Mock Test Series', description: 'Practice tests designed to strengthen your concepts, improve speed, and boost accuracy before the exam.', iconName: 'ClipboardList' },
      { title: 'Digital PDF Format', description: 'Instantly downloadable PDFs for easy reading on any device, anytime - perfect for quick revision.', iconName: 'FileText' },
    ],
    packages: [
      { id: 'notes', title: 'Notes Only', subtitle: 'All 10 Units', price: '\u20b9999', priceAmount: 999, featuresList: ['Complete Notes - All 10 Units', 'Structured and Easy-to-Revise Format', 'PDF Digital Download', 'Latest NET/JRF Courses Aligned'] },
      { id: 'mock', title: 'Mock Tests Only', subtitle: 'Full Test Series', price: '\u20b9666', priceAmount: 666, featuresList: ['Mock Test Series', 'Concept Strengthening Questions', 'Answer Keys Included', 'Exam-Pattern Based'] },
      { id: 'combo', title: 'Combo Pack', subtitle: 'Notes + Mock Tests', price: '\u20b91499', priceAmount: 1499, badge: 'BEST VALUE', featuresList: ['Complete Notes - All 10 Units', 'Full Mock Test Series', 'PDF Digital Downloads', 'Priority Support'] },
    ],
  },
  {
    title: 'FACT and FACT Plus Study Material',
    slug: 'fact-and-fact-plus',
    description: 'Comprehensive study material and previous year question analysis for FACT and FACT Plus exams.',
    iconName: 'ClipboardList',
    order: 2,
    introParagraphs: [
      'Dear Student,',
      'Welcome to the FACT and FACT Plus preparation course.',
      'This material is designed to cover the exact courses and pattern of the Forensic Aptitude and Caliber Test, ensuring you are fully prepared for both basic and advanced levels.',
    ],
    features: [
      { title: 'Targeted Notes', description: 'Notes specific to FACT and FACT Plus requirements.', iconName: 'BookOpen' },
      { title: 'Previous Year Analysis', description: 'Detailed breakdown of previous year papers.', iconName: 'ClipboardList' },
    ],
    packages: [
      { id: 'full', title: 'Complete Package', subtitle: 'Notes + PYQs', price: '\u20b91299', priceAmount: 1299, badge: 'RECOMMENDED', featuresList: ['Targeted Notes', 'PYQ Analysis', 'PDF Downloads'] },
    ],
  },
  {
    title: 'JSA (Junior Scientific Assistant) Preparation',
    slug: 'jsa',
    description: 'Targeted notes and mock tests for the JSA examination.',
    iconName: 'FileText',
    order: 3,
    introParagraphs: ['Welcome to the JSA preparation module. We have compiled the best resources to help you crack the Junior Scientific Assistant exam.'],
    features: [{ title: 'JSA Specific Notes', description: 'Covering all core forensic principles required for JSA.', iconName: 'BookOpen' }],
    packages: [{ id: 'full', title: 'Complete Course', subtitle: 'Notes + Tests', price: '\u20b9899', priceAmount: 899, featuresList: ['Core Notes', 'Practice Tests'] }],
  },
  {
    title: 'SSA (Senior Scientific Assistant) Preparation',
    slug: 'ssa',
    description: 'Advanced study material for the SSA examination.',
    iconName: 'Target',
    order: 4,
    introParagraphs: ['Welcome to the SSA preparation module. This material covers advanced topics required for the Senior Scientific Assistant role.'],
    features: [{ title: 'Advanced Notes', description: 'In-depth coverage of specialized forensic fields.', iconName: 'BookOpen' }],
    packages: [{ id: 'full', title: 'Complete Course', subtitle: 'Notes + Tests', price: '\u20b91099', priceAmount: 1099, featuresList: ['Advanced Notes', 'Mock Exams'] }],
  },
  {
    title: 'SSO (Senior Scientific Officer) Preparation',
    slug: 'sso',
    description: 'Expert-level material for Senior Scientific Officer candidates.',
    iconName: 'Sparkles',
    order: 5,
    introParagraphs: ['Welcome to the SSO preparation module. Designed for professionals aiming for the Senior Scientific Officer designation.'],
    features: [{ title: 'Expert Notes', description: 'High-level scientific and administrative protocols.', iconName: 'BookOpen' }],
    packages: [{ id: 'full', title: 'Complete Course', subtitle: 'Comprehensive Material', price: '\u20b91999', priceAmount: 1999, badge: 'ELITE', featuresList: ['Expert Level Notes', 'Case Studies', 'Interview Prep Guide'] }],
  },
  {
    title: 'CUET UG and PG Preparation',
    slug: 'cuet-ug-pg',
    description: 'Comprehensive study material and mock tests for CUET UG and PG forensic science exams.',
    iconName: 'BadgeIndianRupee',
    order: 6,
    introParagraphs: [
      'Welcome to the CUET UG and PG preparation module.',
      'This material is specially curated to help you crack the Common University Entrance Test for both Undergraduate and Postgraduate forensic science programs.',
    ],
    features: [
      { title: 'Courses-Aligned Notes', description: 'Notes perfectly aligned with the latest CUET courses.', iconName: 'BookOpen' },
      { title: 'Topic-wise Mocks', description: 'Practice with standard MCQs covering the entire PG curriculum.', iconName: 'Target' },
    ],
    packages: [{ id: 'full', title: 'Complete Course', subtitle: 'Notes + Mocks', price: '\u20b9999', priceAmount: 999, badge: 'BEST VALUE', featuresList: ['Courses-Aligned Notes', 'Practice Mock Tests', 'Digital PDF Format'] }],
  },
]

const existingDocs = await client.fetch(
  '*[_type == "studyMaterial" && slug.current in $slugs]{_id, "slug": slug.current}',
  { slugs: materials.map((material) => material.slug) }
)
const existingBySlug = new Map(existingDocs.map((doc) => [doc.slug, doc._id]))

if (process.argv.includes('--verify')) {
  const docs = await client.fetch(
    '*[_type == "studyMaterial" && slug.current in $slugs] | order(order asc){title, "slug": slug.current, packages[]{id, title, price, priceAmount}, order}',
    { slugs: materials.map((material) => material.slug) }
  )
  console.log(JSON.stringify(docs, null, 2))
  process.exit(0)
}

function keyedItems(items, prefix) {
  return items.map((item, index) => ({
    _key: item.id || `${prefix}-${index + 1}`,
    ...item,
  }))
}

for (const material of materials) {
  const id = existingBySlug.get(material.slug) || `studyMaterial.${material.slug}`
  const fields = {
    title: material.title,
    slug: { _type: 'slug', current: material.slug },
    description: material.description,
    iconName: material.iconName,
    introParagraphs: material.introParagraphs,
    features: keyedItems(material.features, 'feature'),
    packages: keyedItems(material.packages, 'package'),
    order: material.order,
  }

  if (existingBySlug.has(material.slug)) {
    await client.patch(id).set(fields).commit()
    console.log(`Updated ${material.slug}`)
  } else {
    await client.create({ _id: id, _type: 'studyMaterial', ...fields })
    console.log(`Created ${material.slug}`)
  }
}

console.log(`Migrated ${materials.length} study material documents to ${projectId}/${dataset}.`)
