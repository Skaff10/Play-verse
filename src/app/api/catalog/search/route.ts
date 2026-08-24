import { NextResponse } from 'next/server';
import { searchCatalog } from '@/lib/catalog';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  try {
    const results = await searchCatalog(q, type);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Catalog search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
