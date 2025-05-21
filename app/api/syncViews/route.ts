// app/api/syncWeeklyViews/route.ts
import { NextResponse } from 'next/server';
import { syncWeeklyViewsToMongo, resetWeeklyViews } from '@lib/server/incrementView';

export async function GET() {
  try {
    await resetWeeklyViews()
    await syncWeeklyViewsToMongo();
    return NextResponse.json({ message: 'Weekly sync successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync weekly views' }, { status: 500 });
  }
}
