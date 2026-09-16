import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HiOutlineMapPin, HiOutlineSparkles} from "react-icons/hi2";

import {
  MapCard,
  MapHeader,
  MapTitle,
  JourneyBadge,
  MapContainerWrapper,
} from "./MapItinerary.styles";

// Fallback City Coordinates Lookup [lat, lng]
const CITY_COORDINATES = {
  rome: [41.9028, 12.4964],
  amalfi: [40.634, 14.6027],
  positano: [40.6281, 14.485],
  ravello: [40.6486, 14.6117],
  venice: [45.4408, 12.3155],
  florence: [43.7696, 11.2558],
  milan: [45.4642, 9.19],
  naples: [40.8518, 14.2681],
  capri: [40.5507, 14.2426],
  paris: [48.8566, 2.3522],
  nice: [43.7102, 7.262],
  chamonix: [45.9237, 6.8694],
  tokyo: [35.6762, 139.6503],
  kyoto: [35.0116, 135.7681],
  osaka: [34.6937, 135.5023],
  zurich: [47.3769, 8.5417],
  interlaken: [46.6863, 7.8632],
  zermatt: [45.9765, 7.7491],
  london: [51.5074, -0.1278],
  edinburgh: [55.9533, -3.1883],
  newyork: [40.7128, -74.006],
  barcelona: [41.3851, 2.1734],
  madrid: [40.4168, -3.7038],
  athens: [37.9838, 23.7275],
  santorini: [36.3932, 25.4615],
  cairo: [30.0444, 31.2357],
  delhi: [28.6139, 77.209],
  agra: [27.1767, 78.0081],
  jaipur: [26.9124, 75.7873],
  mumbai: [19.076, 72.8777],
  goa: [15.2993, 74.124],
  sydney: [-33.8688, 151.2093],
  bali: [-8.4095, 115.1889],
};

// Map Animation Controller: Flies smoothly to active point when activeIndex changes
function AnimatedMapController({ activePoint }) {
  const map = useMap();

  useEffect(() => {
    if (!activePoint) return;
    map.flyTo(activePoint.coords, 10, {
      animate: true,
      duration: 1.2,
    });
  }, [map, activePoint]);

  return null;
}

// Helper: Extract valid [lat, lng] coordinates
function getCoordinates(item, index) {
  const loc = item.location || {};

  // Check explicit coordinates
  if (Array.isArray(loc.coordinates) && loc.coordinates.length === 2) {
    const [c1, c2] = loc.coordinates;
    // MongoDB GeoJSON stores [lng, lat]
    if (Math.abs(c1) <= 180 && Math.abs(c2) <= 90) {
      return [c2, c1];
    }
    return [c1, c2];
  }

  // Fallback to city name lookup
  const cityName = (loc.city || "").toLowerCase().replace(/[^a-z]/g, "");
  if (cityName && CITY_COORDINATES[cityName]) {
    return CITY_COORDINATES[cityName];
  }

  // Fallback to default journey route offset around Italy Amalfi coast
  return [40.634 + index * 0.05, 14.6027 + index * 0.04];
}

// Custom Teardrop Pin Marker with Day Number Inside
function createProperPinMarkerIcon(dayNumber, isActive) {
  return L.divIcon({
    className: "custom-proper-marker",
    html: `
      <div class="pin-marker-wrapper">
        <div class="pin-marker-body ${isActive ? "active-pin" : ""}">
          <span class="pin-marker-day">D${dayNumber}</span>
        </div>
        <div class="pin-marker-pulse"></div>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 52],
  });
}

function MapItinerary({ itinerary = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Extract points with coordinates and metadata
  const journeyPoints = useMemo(() => {
    if (!Array.isArray(itinerary)) return [];

    return itinerary.map((item, idx) => {
      const coords = getCoordinates(item, idx);
      const dayNum = item.day || idx + 1;
      const title = item.title || `Day ${dayNum} Stop`;
      const description = item.description || "";
      const locationText = [
        item.location?.city,
        item.location?.state,
        item.location?.country,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        id: idx,
        dayNum,
        title,
        description,
        locationText: locationText || "Journey Location",
        coords,
      };
    });
  }, [itinerary]);

  // One-by-one sequential point animation loop
  useEffect(() => {
    if (!journeyPoints || journeyPoints.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % journeyPoints.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [journeyPoints]);

  if (journeyPoints.length === 0) return null;

  const activePoint = journeyPoints[activeIndex] || journeyPoints[0];
  const polylineRoute = journeyPoints.map((p) => p.coords);
  const initialCenter = journeyPoints[0]?.coords || [40.634, 14.6027];

  return (
    <MapCard>
      <MapHeader>
        <MapTitle>
          Tour Journey Map
        </MapTitle>
        <JourneyBadge>
          <HiOutlineSparkles /> {journeyPoints.length} Stops Journey
        </JourneyBadge>
      </MapHeader>

      <MapContainerWrapper>
        <MapContainer
          center={initialCenter}
          zoom={9}
          dragging={false}
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          keyboard={false}
          boxZoom={false}
        >
          {/* Clean White CartoDB Voyager TileLayer (Suitable for Website Theme) */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Smooth Sequential Animation Controller */}
          <AnimatedMapController activePoint={activePoint} />

          {/* Animated Connecting Polyline Route */}
          <Polyline
            positions={polylineRoute}
            color="#06070b"
            weight={3.5}
            opacity={0.85}
            dashArray="6, 6"
          />

          {/* Day Pin Markers & Sequential Active Tooltips */}
          {journeyPoints.map((point, idx) => {
            const isActive = idx === activeIndex;

            return (
              <Marker
                key={point.id}
                position={point.coords}
                icon={createProperPinMarkerIcon(point.dayNum, isActive)}
              >
                {isActive && (
                  <Tooltip
                    permanent={true}
                    direction="top"
                    offset={[0, -52]}
                    className="custom-horizontal-tooltip"
                  >
                    <div className="horizontal-tooltip-content">
                      <div className="tooltip-day-badge">Day {point.dayNum}</div>
                      <div className="tooltip-info-block">
                        <div className="tooltip-title">{point.title}</div>
                        {point.description && (
                          <div className="tooltip-desc">{point.description}</div>
                        )}
                        <div className="tooltip-location">
                          <HiOutlineMapPin /> {point.locationText}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                )}
              </Marker>
            );
          })}
        </MapContainer>
      </MapContainerWrapper>
    </MapCard>
  );
}

export default MapItinerary;
