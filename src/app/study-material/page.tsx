import { getStudyMaterials } from '@/src/sanity/queries';
import StudyMaterialListClient from './StudyMaterialListClient';

const FALLBACK_MATERIALS = [
  { _id: '1', title: 'UGC NET JRF', slug: 'ugc-net-jrf', description: 'Complete notes for all 10 units and a mock test series.' },
  { _id: '2', title: 'Fact & Fact Plus', slug: 'fact-and-fact-plus', description: 'Study material for FACT and FACT Plus exams.' },
  { _id: '3', title: 'JSA', slug: 'jsa', description: 'Junior Scientific Assistant preparation material.' },
  { _id: '4', title: 'SSA', slug: 'ssa', description: 'Senior Scientific Assistant preparation material.' },
  { _id: '5', title: 'SSO', slug: 'sso', description: 'Senior Scientific Officer preparation material.' },
];

export default async function StudyMaterialIndex() {
  let materials;
  try {
    materials = await getStudyMaterials();
  } catch (e) {
    materials = null;
  }

  const resolvedMaterials = materials && materials.length > 0 ? materials : FALLBACK_MATERIALS;

  return <StudyMaterialListClient materials={resolvedMaterials} />;
}
