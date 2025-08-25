'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trip } from '../models/Trip';
import { Button, FormControl, FormControlLabel, InputAdornment, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import StateSelector from './stateselector';

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) console.log("No Mapbox token");

export default function EditTripPage({ id }: { id: string }) {
    
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await fetch(`/api/trips/${id}`);
                if (!res.ok) throw new Error('Failed to fetch trip');
                const data = await res.json();
                setTrip(data);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchTrip();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTrip(prev => prev ? {
            ...prev,
            [name]: ['hotelCost', 'transportCost'].includes(name) ? parseFloat(value) || 0 : value
        } : prev);
    };

    const getLatLon = async (place: string) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(place)}&access_token=${mapboxToken}`
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trip) return;

        const latLon = await getLatLon(trip.destination);
        if (!latLon) return alert('Unable to retrieve coordinates for destination.');

        const updatedTrip = {
            ...trip,
            latitude: latLon.latitude,
            longitude: latLon.longitude,
            from: new Date(trip.from).toISOString(),
            till: new Date(trip.till).toISOString(),
        };

        const res = await fetch('/api/trips', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, trip: updatedTrip }),
        });

        if (res.ok) {
            router.push('/');
        } else {
            const errMsg = await res.text();
            alert(errMsg);
        }
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toISOString().split('T')[0];
    };

    if (loading) return <p className='p-4'>Loading...</p>;
    if (error) return <p className='p-4 text-red-500'>Error: {error}</p>;
    if (!trip) return null;

    


    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Trip</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <TextField name="destination" value={trip.destination} onChange={handleChange} label="Destination" className="w-full p-2 border" />
                </div>
                <StateSelector trip={trip} handleChange={handleChange}/>
         
                <div>
                    <TextField name="from" type="date" value={formatDate(trip.from.toString())} onChange={handleChange} label="From" className="w-full p-2 border mt-20" />
                </div>
                <div>
                    <TextField name="till" type="date" value={formatDate(trip.till.toString())} onChange={handleChange} label="Till" className="w-full p-2 border" />
                </div>

                <div className="flex w-full">
                    <TextField
                        name="hotel"
                        value={trip.hotel}
                        onChange={handleChange}
                        label="Hotel"
                        className="w-[80%] p-2 border"
                    />
                    <TextField
                        name="hotelCost"
                        type="number"
                        value={trip.hotelCost}
                        onChange={handleChange}
                        label="Hotel Cost"
                        className="w-[20%] p-2 border"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                            ),
                        }}
                        inputProps={{
                            inputMode: 'decimal',
                        }}
                    />
                </div>

                <div className='flex w-full'>
                    <TextField name="transportMode" value={trip.transportMode} onChange={handleChange} label="Transport Mode" className="w-[80%] p-2 border" />
                    <TextField name="transportCost" type="number" value={trip.transportCost} onChange={handleChange} label="Transport Cost" className="w-[20%] p-2 border" InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                        ),
                    }}
                        inputProps={{
                            inputMode: 'decimal',
                        }} />
                </div>

                <TextField multiline name="notes" value={trip.notes} onChange={handleChange} label="Notes" rows={5} className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />

                <FormControl>
                    <RadioGroup
                        row
                        name="status"
                        value={trip.status}
                        onChange={handleChange}
                    >
                        {['Scheduled', 'Completed'].map((status) => (
                            <FormControlLabel
                                key={status}
                                value={status}
                                control={<Radio />}
                                label={status}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>

                <div className="flex justify-center">
                    <Stack direction="row" spacing={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={() => router.push('/')}
                        >
                            Back
                        </Button>
                    </Stack>
                </div>
            </form>
        </div>
    );
}
