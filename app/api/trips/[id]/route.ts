// app/api/trips/[id]/route.ts

import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request, context: { params : {  id: string  }}
) {
  try {
    const param = await context.params;
    const trip = await prisma.trip.findUnique({
      where: { id: await param.id },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('GET /api/trips/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}
