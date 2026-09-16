import { getCountry } from "../../../Services/getCountry";


import "leaflet/dist/leaflet.css";
import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import styled from "styled-components";

const whiteMarker = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width:22px;
        height:22px;
        background:#d6cbcb;
        border:3px solid #111827;
        border-radius:50%;
        position:relative;
        box-shadow:
          0 0 0 8px rgba(255,255,255,.15),
          0 10px 25px rgba(0,0,0,.45);
      "
    >
      <div
        style="
          position:absolute;
          left:50%;
          bottom:-11px;
          transform:translateX(-50%);
          width:0;
          height:0;
          border-left:8px solid transparent;
          border-right:8px solid transparent;
          border-top:12px solid white;
        "
      ></div>
    </div>
  `,
  iconSize: [22, 34],
  iconAnchor: [11, 34],
  popupAnchor: [0, -30],
});

const Container = styled.section`
  width: min(140rem, 80%);
  margin: 0 auto;
`;

const PopupContainer = styled.div`
  width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const PopupHeading = styled.h3`
  margin: 0;
  font-size: 1.8rem;
`;

const Coordinates = styled.p`
  margin: 0;
  color: #090909;
  font-size: 1.25rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
`;

const Select = styled.select`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  outline: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SearchButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: #000000;
  color: white;
  cursor: pointer;
`;

const BookmarkButton = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #f8f1f1;
  cursor: pointer;
`;

function ClickHandler({ setSelectedPosition }) {
  useMapEvents({
    click(e) {
      setSelectedPosition(e.latlng);
    },
  });

  return null;
}

function Map() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [radius, setRadius] = useState(10);
  const [tourType, setTourType] = useState("All");
const [location, setLocation] = useState(null);
    
  const markerRef = useRef(null);

  useEffect(() => {
    if (selectedPosition && markerRef.current) {
      setTimeout(() => {
        markerRef.current.openPopup();
      }, 0);
    }
  }, [selectedPosition]);

  const handleSearch = () => {
    console.log({
      latitude: selectedPosition.lat,
      longitude: selectedPosition.lng,
      radius,
      tourType,
    });
  };

  const handleBookmark = () => {
    console.log({
      latitude: selectedPosition.lat,
      longitude: selectedPosition.lng,
      radius,
      tourType,
    });
  };

    useEffect(() => {
    
         if (!selectedPosition) return;
  async function fetchLocation() {
      setLocation(null);

      try {
         
      const data = await getCountry(selectedPosition.lat, selectedPosition.lng);

       setLocation(data);
      
    } catch (err) {
      console.error(err);
    }
  }

    
    fetchLocation();
    
    
}, [selectedPosition]);
    
  return (
    <Container>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        scrollWheelZoom
        style={{
          width: "100%",
          height: "80vh",
          borderRadius: "20px",
        }}
      >
        <TileLayer
          attribution="&copy; Stadia Maps, OpenMapTiles & OpenStreetMap contributors"
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        <ClickHandler setSelectedPosition={setSelectedPosition} />

        {selectedPosition && (
          <Marker
            ref={markerRef}
            position={selectedPosition}
            icon={whiteMarker}
          >
            <Popup minWidth={300}>
              <PopupContainer>
                <PopupHeading>Selected Location</PopupHeading>

                <Coordinates>
                  {
                     location
                   }
                </Coordinates>

                <Field>
                  <Label>Search Radius</Label>

                  <Select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                    <option value={100}>100 km</option>
                  </Select>
                </Field>

                <Field>
                  <Label>Tour Type</Label>

                  <Select
                    value={tourType}
                    onChange={(e) => setTourType(e.target.value)}
                  >
                    <option>All</option>
                    <option>Adventure</option>
                    <option>Nature</option>
                    <option>Beach</option>
                    <option>Wildlife</option>
                    <option>Luxury</option>
                    <option>Camping</option>
                    <option>Spiritual</option>
                  </Select>
                </Field>

                <ButtonGroup>
                  <SearchButton onClick={handleSearch}>Search</SearchButton>

                  <BookmarkButton onClick={handleBookmark}>
                     Bookmark 
                  </BookmarkButton>
                </ButtonGroup>
              </PopupContainer>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Container>
  );
}

export default Map;
