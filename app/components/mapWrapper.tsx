'use client';

import dynamic from 'next/dynamic';
import { Trip } from '../models/Trip';
import DestinationsList from './destinationsList';
import { useState } from 'react';
import TripDetails from './tripDetails';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

    function addNewTrip(): void {
        // navigate to the edit page for the new trip
        router.push('/new');
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 h-100">
            <div className="sm:col-span-3 h-[400px] sm:h-[600px]">
                <MapClient trips={trips} geoData={geoData} stateColors={stateColors} selectedTrip={selectedTrip} />
            </div>

            <div className="sm:col-span-1 h-[400px] sm:h-[600px] border border-gray-200 rounded-lg shadow p-2 m-2">
                {selectedTrip ? (
                    <div>
                        <div className='mb-2 font-bold text-lg flex justify-between items-center px-8'>
                            <Button onClick={() => setSelectedTrip(null)} className="m-2" variant="outlined" size="small" disabled={!selectedTrip}>List</Button>
                            <Button
                                onClick={() => router.push(`/${selectedTrip?.id}/edit`)}
                                className="m-2"
                                variant="outlined"
                                size="small"
                                disabled={!selectedTrip}
                            >
                                Edit
                            </Button>
                        </div>
                        <TripDetails trip={selectedTrip} />
                    </div>

                )
                    : (<>
                        <div className='mb-2 font-bold text-lg flex justify-center items-center'>
                            <Button onClick={addNewTrip} className="m-2" variant="outlined" size="small">Add New Trip</Button>
                        </div>
                        <DestinationsList trips={trips} setSelectedTrip={setSelectedTrip} />
                        
                        </>)
                }
            </div>
        </div>
    )
}
