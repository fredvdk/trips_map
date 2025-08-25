'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../components/layout';

export default function EditTripPage({ params }: { params: { id: string } }) {
    const { id } = useParams();
    const router = useRouter();


    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function formatDate(isoDate: Date) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(',', '');
    }

    function formatCurrency(amount: String) {
        return "$" + amount;
    }

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await fetch(`/api/trips/${id}`);
                if (!res.ok) throw new Error('Failed to fetch trip');
                const data = await res.json();
                setTrip(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTrip({ ...trip, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/trips', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, trip: trip }),
        });
        if (res.ok) {
            router.push(`/`);
        } else {
            alert(res.json);
        }
    };

    if (loading) return <Layout><p className='p-4'>Loading...</p></Layout>
    if (error) return <Layout><p className="p-4 text-red-500">Error: {error}</p></Layout>;
    if (!trip) return null;

    return (
        <Layout>
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center">Edit Trip</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="destination"
                        value={trip.destination}
                        onChange={handleChange}
                        placeholder="Destination"
                        className="w-full p-2 border"
                    />
                    <input
                        name="from"
                        value={formatDate(trip.from)}
                        onChange={handleChange}
                        placeholder="From Date"
                        className="w-full p-2 border"
                    />
                    <input
                        name="till"
                        value={formatDate(trip.till)}
                        onChange={handleChange}
                        placeholder="Till Date"
                        className="w-full p-2 border"
                    />
                    <input
                        name="hotel"
                        value={trip.hotel}
                        onChange={handleChange}
                        placeholder="Hotel"
                        className="w-full p-2 border"
                    />
                    <input
                        name="hotelCost"
                        type="number"
                        value={formatCurrency(trip.hotelCost)}
                        onChange={handleChange}
                        placeholder="Hotel Cost"
                        className="w-full p-2 border"
                    />
                    <input
                        name="transportMode"
                        value={trip.transportMode}
                        onChange={handleChange}
                        placeholder="Transport Mode"
                        className="w-full p-2 border"
                    />
                    <input
                        name="transportCost"
                        type="number"
                        value={formatCurrency(trip.transportCost)}
                        onChange={handleChange}
                        placeholder="Transport Cost"
                        className="w-full p-2 border"
                    />
                    <textarea
                        name="notes"
                        value={trip.notes}
                        onChange={handleChange}
                        placeholder="Notes"
                        className="w-full p-2 border"
                    />
                    {/* Dropdown for status */}
                    <select
                        name="status"
                        value={trip.status}
                        onChange={handleChange}
                        className="w-full p-2 border"
                    >

                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className='flex justify-center'>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded mr-2">
                            Save Changes
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={()=>router.push('/')}>
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
