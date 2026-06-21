import { getStudyMaterials } from '@/src/sanity/queries';
import StudyMaterialListClient from './StudyMaterialListClient';

const FALLBACK_MATERIALS = [
  { _id: '1', title: 'UGC NET JRF', slug: 'ugc-net-jrf', description: 'Complete notes for all 10 units and a mock test series.' },
  { _id: '2', title: 'Fact & Fact Plus', slug: 'fact-and-fact-plus', description: 'Study material for FACT and FACT Plus exams.' },
  { _id: '3', title: 'JSA', slug: 'jsa', description: 'Junior Scientific Assistant preparation material.' },
  { _id: '4', title: 'SSA', slug: 'ssa', description: 'Senior Scientific Assistant preparation material.' },
  { _id: '5', title: 'SSO', slug: 'sso', description: 'Senior Scientific Officer preparation material.' },
  { _id: '6', title: 'CUET UG PG', slug: 'cuet-ug-pg', description: 'Comprehensive study material and mock tests for CUET UG and PG forensic science exams.' },
];

export default async function StudyMaterialIndex() {
  let materials;
  try {
    materials = await getStudyMaterials();
  } catch (e) {
    materials = null;
  }

  // Merge fallback and sanity materials based on slug
  const sanityMaterials = materials || [];
  const materialMap = new Map();
  
  FALLBACK_MATERIALS.forEach((mat: any) => materialMap.set(mat.slug, mat));
  sanityMaterials.forEach((mat: any) => {
    if (mat.slug) materialMap.set(mat.slug, mat);
  });
  
  const resolvedMaterials = Array.from(materialMap.values());

  return <StudyMaterialListClient materials={resolvedMaterials} />;
}
