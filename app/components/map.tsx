'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, Icon, LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

import blueMarker from './images/marker_icon_blue.png';
import redMarker from './images/marker_icon_red.png';

interface Trip {
  latitude: number;
  longitude: number;
  status: string;
  destination: string;
}

interface MapProps {
  trips: Trip[];
}

// Custom icons
const blueIcon = new Icon({
  iconUrl: blueMarker.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new Icon({
  iconUrl: redMarker.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ trips }: { trips: Trip[] }) {
  const map = useMap();
  useEffect(() => {
    if (trips.length > 0) {
      const bounds = trips.map((t) => [
        t.latitude,
        t.longitude,
      ]) as LatLngBoundsExpression;
      map.fitBounds(bounds);
    }
  }, [map, trips]);
  return null;
}


const drawlocations = (locations: Trip[]) => {
  return locations.map((location, index) => (
    <Marker
      key={index}
      position={[location.latitude, location.longitude] as LatLngExpression}
      icon={location.status === 'Completed' ? blueIcon : redIcon}
    >
      <Popup>
        <strong>{location.destination}</strong>
        <br />
        Status: {location.status}
      </Popup>
    </Marker>
  ));
};

export default function Map(props: MapProps) {
  const initialPosition: LatLngExpression = [40, -75]; // Default center
  const { trips } = props;

  useEffect(() => {
    console.log('Trips changed:', trips);
    drawlocations(trips);
  }, [trips]);

  return (
    <MapContainer
      center={initialPosition}
      zoom={6}
      style={{ height: '500px', width: '100%' }}
    >
      <FitBounds trips={trips} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {drawlocations(trips)}
    </MapContainer>
  );
}
