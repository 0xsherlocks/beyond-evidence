import { getStudyMaterials } from '@/src/sanity/queries';
import StudyMaterialListClient from './StudyMaterialListClient';

export default async function StudyMaterialIndex() {
  const materials = await getStudyMaterials();

  return <StudyMaterialListClient materials={materials || []} />;
}
