import { Trip } from "../models/Trip";

interface TripDetailsProps {
    trip: Trip;
}

const TripDetails = ({trip} : TripDetailsProps) => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{trip.destination}</h1>    
            <p><strong>From:</strong> {new Date(trip.from).toLocaleDateString()}</p>
            <p><strong>Till:</strong> {new Date(trip.till).toLocaleDateString()}</p>
            <p><strong>Hotel:</strong> {trip.hotel}</p>
            <p><strong>Hotel Cost:</strong> {trip.hotelCost}</p>
            <p><strong>Transport :</strong> {trip.transportMode}</p>
            <p><strong>Transport Cost:</strong> {trip.transportCost}</p>
            <p><strong>Notes:</strong> {trip.notes}</p>
            <p><strong>Status:</strong> {trip.status}</p>
        </div>
    )
}

export default TripDetails;