import Layout from "../layout";


interface PageProps {
    params: { id: string };
}

export default async function TripDetailsPage({ params }: PageProps) {
    const { id } = await params

    const res = await fetch(`http://localhost:3000/api/trips/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        return <div className="p-4">Error loading trip details.</div>;
    }

    const trip = await res.json();

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">Trip Details</h1>
                <p><strong>ID:</strong> {trip.id}</p>
                <p><strong>Destination:</strong> {trip.destination}</p>
                <p><strong>From:</strong> {trip.from}</p>
                <p><strong>Till:</strong> {trip.till}</p>
                <p><strong>Hotel:</strong> {trip.hotel}</p>
                <p><strong>Hotel Cost:</strong> {trip.hotelCost}</p>
                <p><strong>Transport :</strong> {trip.transportMode}</p>
                <p><strong>Transport Cost:</strong> {trip.transportCost}</p>
                <p><strong>Notes:</strong> {trip.notes}</p>
                <p><strong>Status:</strong> {trip.status}</p>
            </div>
        </Layout>
    );
}
