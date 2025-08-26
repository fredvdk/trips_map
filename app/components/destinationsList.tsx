'use client';

import React from "react";
import { Trip } from "../models/Trip";

interface DestinationsListProps {
    trips: Trip[];
    setSelectedTrip: (trip: Trip | null) => void;
}

export default function DestinationsList({ trips, setSelectedTrip }: DestinationsListProps) {
    trips.sort((a, b) => a.destination.localeCompare(b.destination) );
    return (
        <ul className="p-4">
            {trips.map((trip, i) => (
                <li key={`${trip.id}-${i}`} 
                    className={`border-b border-gray-200 ${trip.status === 'Completed' ? 'text-blue-600' : 'text-red-600'} mb-2 pb-2`}
                    onClick={()=>setSelectedTrip(trip)}
                    >
                    {trip.destination}, {trip.state}
                </li>
            ))}
        </ul>
    );
}
