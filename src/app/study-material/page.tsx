import { getStudyMaterials } from '@/src/sanity/queries';
import StudyMaterialListClient from './StudyMaterialListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudyMaterialIndex() {
  const materials = await getStudyMaterials();

  return <StudyMaterialListClient materials={materials || []} />;
}
