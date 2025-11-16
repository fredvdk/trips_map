import { prisma } from '@/app/lib/prisma';
import { Status } from '@prisma/client';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) console.log('No Mapbox token');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const checkToken = async (req: NextRequest) => {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return null;
  }
  return user;
};


// GET: Fetch all trips
export async function GET(req: NextRequest) {
  const user = await checkToken(req);
 // if (!user) {
 //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 // }
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

 const getLatLon = async (place: string) => {
   try {
     const response = await fetch(
       `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
         place
       )}&access_token=${mapboxToken}`
     );
     if (!response.ok)
       throw new Error(`HTTP error! status: ${response.status}`);
     const data = await response.json();
     const coords = data.features?.[0]?.geometry?.coordinates;
     return coords && coords.length === 2
       ? { latitude: coords[1], longitude: coords[0] }
       : null;
   } catch (err) {
     console.error('Error getting latlon:', err);
     return null;
   }
 };


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

    // Ensure numeric fields are plain numbers (Prisma expects number | null for these fields)
    const latLon = await getLatLon(trip.destination + ' ' + trip.state);

    const tripToSave = {
      id: randomUUID(),
      destination: trip.destination?.replace(/\0/g, '') || 'Unknown',
      from: trip.from ? new Date(trip.from) : null,
      till: trip.till ? new Date(trip.till) : null,
      hotel: trip.hotel?.replace(/\0/g, '') || '',
      state: trip.state?.replace(/\0/g, '') || '',
      hotelCost:
        trip.hotelCost != null
          ? Number(trip.hotelCost)
          : null,
      transportMode: trip.transportMode?.replace(/\0/g, '') || '',
      transportCost:
        trip.transportCost != null
          ? Number(trip.transportCost)
          : null,
      latitude:
        latLon?.latitude != null
          ? latLon.latitude
          : 0,
      longitude:
        latLon?.longitude != null
          ? latLon.longitude
          : 0,
      status: trip.status === 'Completed' ? Status.Completed : Status.Scheduled,
      created: new Date(),
      updated: new Date()
    };

    const newTrip = await prisma.trip.create({ data: tripToSave });

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
