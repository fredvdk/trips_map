'use client';

import dynamic from 'next/dynamic';
import { Trip } from '../models/Trip';
import DestinationsList from './destinationsList';
import { useState } from 'react';

const MapClient = dynamic(() => import('./map'), {
    ssr: false, // never render on the server
});

interface MapWrapperProps {
    trips: Trip[];
    geoData: GeoJSON.GeoJsonObject;
    stateColors: { [key: string]: string };
}

export default function MapWrapper({ trips, geoData, stateColors }: MapWrapperProps) {
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 h-100">
            <div className="sm:col-span-3 h-[400px] sm:h-[600px]">
                <MapClient trips={trips} geoData={geoData} stateColors={stateColors} selectedTrip={selectedTrip}/>
            </div>
            <div className="sm:col-span-1 h-[400px] sm:h-[600px] overflow-y-auto border border-gray-200 rounded-lg shadow p-2 m-2">
                <DestinationsList trips={trips} setSelectedTrip={setSelectedTrip} />
            </div>
        </div>
    )
}
