import { NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/server/verifyTransaction';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('ref');

  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
  }

  try {
    const result = await verifyTransaction(reference);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}