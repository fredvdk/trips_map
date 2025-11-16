
import { Trip } from '@prisma/client';
import { prisma } from '@/app/lib/prisma';
import path from "path";
import fs from 'fs/promises';
import MapWrapper from "./mapWrapper";

//disable caching and make the page always dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function HomePageBody() {
  
  const rows: Trip[] = await prisma.trip.findMany();

  // Convert Decimal fields to Number
  const trips = rows.map(trip => ({
    ...trip,
    hotelCost: Number(trip.hotelCost),      // convert Decimal → Number
    transportCost: Number(trip.transportCost),
    latitude: Number(trip.latitude),
    longitude: Number(trip.longitude), // convert Decimal → Number
  }));

  // Read GeoJSON from disk
  const geoPath = path.join(process.cwd(), 'data', 'USA_states_geo.json');
  const geoRaw = await fs.readFile(geoPath, 'utf-8');
  const geoData = JSON.parse(geoRaw);

  // Create stateColors mapping based on trip status
  const createStateColors = () => {
    const statusColorMap = {
      Scheduled: "#FF5733",  // red-ish
      Completed: "#337BFF",  // blue-ish
    };
    const stateColors = trips.reduce((acc: Record<string, string>, { state, status }) => {
      acc[state!] = status === "Completed"
        ? statusColorMap.Completed
        : statusColorMap.Scheduled;
      return acc;
    }, {});
    return stateColors;
  };

  return (
    <div className="px-2">
      <h1 className="text-4xl font-extrabold text-center tracking-tight text-gray-900 md:text-5xl md:my-8 lg:text-6xl dark:text-white">
        USA trips
      </h1>
      <MapWrapper trips={trips} geoData={geoData} stateColors={createStateColors()} />
    </div>
  );
}
