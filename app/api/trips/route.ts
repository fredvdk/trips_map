import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch all trips
export async function GET() {
  try {
    const allTrips = await prisma.trip.findMany();
    return NextResponse.json(allTrips);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

// POST: Create a new trip
export async function POST(req: Request) {
  try {
    const { trip } = await req.json();

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip data is required' },
        { status: 400 }
      );
    }

    const newTrip = await prisma.trip.create({
      data: trip,
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}

// PUT: Update a trip
export async function PUT(req: Request) {
  try {
    const { id, trip } = await req.json();

    if (!id || !trip) {
      return NextResponse.json(
        { error: 'Trip ID and data are required' },
        { status: 400 }
      );
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: trip,
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a trip
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `Trip with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}
