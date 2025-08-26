/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { MapContainer, GeoJSON, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, Icon, PathOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import blueMarker from './images/marker_icon_blue.png';
import redMarker from './images/marker_icon_red.png';
import { Trip } from '../models/Trip';

interface MapProps {
  trips: Trip[];
  geoData: GeoJSON.GeoJsonObject;
  stateColors: { [key: string]: string };
  selectedTrip: Trip | null;
}

const formatDate = (isoDate: Date) =>
  new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).replace(',', '');


function TripMarkers({ trips }: { trips: Trip[] }) {
  const blueIcon = 
      new Icon({
        iconUrl: blueMarker.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

  const redIcon = 
      new Icon({
        iconUrl: redMarker.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

  return (
    <>
      {trips.map((trip) => (
        <Marker
          key={trip.id}
          position={[trip.latitude, trip.longitude]}
          icon={trip.status === 'Completed' ? blueIcon : redIcon}
        >
          <Popup>
            <strong>{trip.destination}</strong>
            <br />
            {formatDate(trip.from)} - {formatDate(trip.till)}
            <br />
            <a href={`/${trip.id}/edit`} className="text-blue-600 underline">
              Details
            </a>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function GeoJSONWithInteractions({ geoData, stateColors }: { geoData: GeoJSON.GeoJsonObject, stateColors: { [key: string]: string } }) {
  const map = useMap(); // ✅ safe here

  const getStateStyle: (feature: any) => PathOptions = (feature) => ({
    fillColor: stateColors[feature?.properties?.NAME] || '#cccccc',
    weight: 1,
    color: 'white',
    fillOpacity: 0.2,
  });

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: () => {
        const polygon = layer as L.Polygon;
        if (polygon.getBounds) {
          map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
        }
      },
      mouseover: (e) => {
        (e.target as L.Path).setStyle({ weight: 2, fillOpacity: 0.2 });
      },
      mouseout: (e) => {
        (e.target as L.Path).setStyle(getStateStyle(feature));
      },
    });
  };

  return <GeoJSON data={geoData} style={getStateStyle} onEachFeature={onEachFeature} />;
}

function FlyToTrip({ trip }: { trip: Trip | null }) {
  const map = useMap();

  React.useEffect(() => {
    if (trip) {
      map.flyTo([trip.latitude, trip.longitude], 10, { duration: 2.5 });
    }
  }, [trip, map]);

  return null;
}



export default function Map({ trips, stateColors, geoData, selectedTrip }: MapProps) {
  const defaultCenter: LatLngExpression = [40, -75];
  console.log('Rendering Map with trips:', trips.length);
  console.log('Selected Trip:', selectedTrip);

  
  return (
    <MapContainer center={defaultCenter} zoom={6} className="w-full h-full" scrollWheelZoom={true}>
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <TripMarkers trips={trips} />
      <FlyToTrip trip={selectedTrip} />

      <GeoJSONWithInteractions geoData={geoData} stateColors={stateColors} />
    </MapContainer>
  );
}
