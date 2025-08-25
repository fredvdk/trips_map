'use client';

import dynamic from 'next/dynamic';
import { Trip } from '../models/Trip';

const MapClient = dynamic(() => import('./map'), {
    ssr: false, // never render on the server
});

interface MapWrapperProps {
    trips: Trip[];
    geoData: GeoJSON.GeoJsonObject;
    stateColors: { [key: string]: string };
}

export default function MapWrapper({ trips, geoData, stateColors }: MapWrapperProps) {
    return <MapClient trips={trips} geoData={geoData} stateColors={stateColors}/>;
}
