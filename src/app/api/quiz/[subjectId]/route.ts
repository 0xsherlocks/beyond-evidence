import { NextResponse } from 'next/server';
import { getQuizBySubject } from '@/src/sanity/queries';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const { subjectId } = await params;

  try {
    const questions = await getQuizBySubject(subjectId);
    return NextResponse.json(questions || []);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
