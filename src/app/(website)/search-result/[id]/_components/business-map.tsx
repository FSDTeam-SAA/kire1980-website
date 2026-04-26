"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

// Custom marker icon
const createCustomIcon = (color = "#0096a1") => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 40px;
      height: 40px;
      background-color: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 3px solid white;
      cursor: pointer;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface BusinessMapProps {
  businessName?: string;
  address?: string;
  city?: string;
  country?: string;
  className?: string;
}

const BusinessMap: React.FC<BusinessMapProps> = ({
  businessName,
  address,
  city,
  country,
  className = "",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Geocode the address to get coordinates
    const geocodeAddress = async () => {
      if (!city || !country) {
        setIsLoading(false);
        return;
      }

      try {
        const searchQuery = `${city}, ${country}`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [city, country]);

  if (!isMounted || isLoading) {
    return (
      <div
        className={`bg-slate-50 rounded-xl overflow-hidden border ${className}`}
      >
        <div className="h-[400px] w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0096a1]"></div>
            <p className="text-sm text-slate-500">Loading location map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border ${className}`}
      >
        <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 p-6">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-slate-500" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Location Information
            </h3>
            <p className="text-slate-600">
              {address && `${address}, `}
              {city && `${city}`}
              {country && `, ${country}`}
            </p>
            <p className="text-sm text-slate-400 mt-3">
              Exact location coordinates not available
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city}, ${country}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#0096a1] text-white rounded-lg hover:bg-[#007a83] transition-colors text-sm"
            >
              <Navigation size={16} />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    );
  }

  const displayAddress = [address, city, country].filter(Boolean).join(", ");

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border ${className}`}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[coordinates.lat, coordinates.lng]}
          icon={createCustomIcon()}
        >
          <Popup>
            <div className="min-w-[220px] py-1">
              <h3 className="font-bold text-slate-800 text-base mb-1">
                {businessName || "Business Location"}
              </h3>
              <p className="text-sm text-slate-600 mb-2">{displayAddress}</p>
              <div className="flex gap-2 mt-2 pt-2 border-t">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs bg-[#0096a1] text-white px-3 py-1.5 rounded-md hover:bg-[#007a83] transition-colors"
                >
                  Get Directions
                </a>
                <a
                  href={`https://www.google.com/maps/place/${coordinates.lat},${coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
                >
                  View Larger
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BusinessMap;
