import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const query = searchParams.get('q')?.trim();
  const items = await prisma.notification.findMany({
    where: { ...(type && type !== 'All' ? { type: type.toLowerCase() } : {}), ...(query ? { OR: [{ title: { contains: query, mode: 'insensitive' } }, { source: { contains: query, mode: 'insensitive' } }, { acronym: { contains: query, mode: 'insensitive' } }] } : {}) },
    orderBy: [{ isNew: 'desc' }, { publishedAt: 'desc' }, { lastUpdated: 'desc' }], take: 100,
  });
  return NextResponse.json(items);
}
