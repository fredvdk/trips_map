'use client';

import React from "react";
import { Trip } from "../models/Trip";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";

interface DestinationsListProps {
    trips: Trip[];
    setSelectedTrip: (trip: Trip | null) => void;
}

export default function DestinationsList({ trips, setSelectedTrip }: DestinationsListProps) {
    trips.sort((a, b) => a.destination.localeCompare(b.destination) );
    const router = useRouter();

    return (
        <ul className="p-4">
            {trips.map((trip, i) => (
                <li key={`${trip.id}-${i}`} 
                    className={`border-b border-gray-200 ${trip.status === 'Completed' ? 'text-blue-600' : 'text-red-600'} mb-2 pb-2`}
                    onClick={()=>setSelectedTrip(trip)}
                    >
                    {trip.destination}, {trip.state}
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the li onClick
                            setSelectedTrip(null);
                            router.push(`/${trip.id}/`);
                        }}
                        className="ml-2"
                        title="Deselect"
                        >
                            <EditIcon />
                        </IconButton>
                </li>
            ))}
        </ul>
    );
}
