import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import * as ramenData from "./data/ramen.json";
import mapStyles from "./mapStyles";

function Map() {
  const TAIWAN_BOUNDS = {
    north: 25.68,
    south: 21.52,
    west: 119.30,
    east: 122.48,
  };

  const [selectedRamen, setSelectedRamen] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedRamen(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 24.78840208718926, lng: 120.99943215557263 }}
      defaultOptions={{ styles: mapStyles, mapTypeControl: false, streetViewControl: false, 
        scaleControl: false, fullscreenControl: false, zoomControl: false, 
        restriction:{latLngBounds: TAIWAN_BOUNDS, strictBounds: false}}}
    >
      {ramenData.features.map(ramen => (
        <Marker
          key={ramen.properties.RAMEN_ID}
          animation={window.google.maps.Animation.DROP}
          position={{
            lat: ramen.geometry.coordinates[1],
            lng: ramen.geometry.coordinates[0]
          }}
          onClick={() => {
            setSelectedRamen(ramen);
          }}
          icon={{
            url: `/homepage-banner-center.png`,
            scaledSize: new window.google.maps.Size(125, 80)
          }}
        />
      ))}

      {selectedRamen && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedRamen(null);
          }}
          position={{
            lat: selectedRamen.geometry.coordinates[1],
            lng: selectedRamen.geometry.coordinates[0]
          }}
        >
          <div>
            <h2>{selectedRamen.properties.NAME}</h2>
            <p>{selectedRamen.properties.DESCRIPTIO}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
          process.env.REACT_APP_GOOGLE_KEY
        }`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}
