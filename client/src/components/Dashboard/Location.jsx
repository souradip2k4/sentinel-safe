import {useState, useMemo, useRef, useCallback, memo, useEffect} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {Marker, Map, Source, Layer} from "react-map-gl";
import {sampleData} from "@/lib/sampleData";
import haversine from "haversine-distance";
import useStore from "@/zustand/store";
import {auth} from "@/firebase.config";
import {useShallow} from "zustand/react/shallow";
import metrics from "@/components/Dashboard/metrics";

const features = sampleData.map((item) => ({
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)],
  },
  properties: {
    campusName: item.campusName,
    color: "#4ade80",
  },
}));

const LocationPage = () => {
  const {locationMetrics, fetchLocationMetrics} = useStore(useShallow(state => ({
    locationMetrics: state.locationMetrics,
    fetchLocationMetrics: state.locationMetrics
  })));

  useEffect(() => {


  }, [locationMetrics]);

  const geoJson = useMemo(
    () => ({
      type: "FeatureCollection",
      features,
    }),
    []
  );

  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: 85.8161,
    latitude: 20.3555,
    zoom: 15,
  });

  const [marker, setMarker] = useState([]);

  const mapConfig = useMemo(
    () => ({
      mapboxAccessToken: process.env.NEXT_PUBLIC_MAP_ACCESS_TOKEN,
      style: {width: "100%", height: "100%"},
      mapStyle: "mapbox://styles/mapbox/satellite-streets-v12",
    }),
    []
  );

  const handleMapLoad = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAP_ACCESS_TOKEN,
        mapboxgl: map,
        countries: "in",
        placeholder: "Search location",
        marker: false,
        autocomplete: true,
      });

      const geocoderContainer = document.createElement("div");
      geocoderContainer.style.position = "absolute";
      geocoderContainer.style.top = "15px";
      geocoderContainer.style.left = "15px";
      geocoderContainer.style.zIndex = "1";
      map.getContainer().appendChild(geocoderContainer);

      geocoderContainer.appendChild(geocoder.onAdd(map));
    }
  }, []);

  const isClickInCircle = (clickPoint, circleCenter, circleRadius) => {
    // Use the Haversine formula for accurate distance calculations
    const distance = haversine(
      {latitude: clickPoint.lat, longitude: clickPoint.lng},
      {latitude: circleCenter.latitude, longitude: circleCenter.longitude}
    );
    return distance <= circleRadius;
  };

  const handleCircleClick = useCallback((clickPoint) => {
    const CIRCLE_RADIUS = 110; // Radius in meters
    for (let feature of features) {
      const {geometry, properties} = feature;
      const circleCenter = {
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      };

      if (isClickInCircle(clickPoint, circleCenter, CIRCLE_RADIUS)) {
        // console.log("Circle clicked:", properties.campusName, circleCenter);

        // Make an API call with the circle's center point

      } else {
        // Location metrics not found logic

      }
    }
  }, []);

  /*  useEffect(() => {
      console.log(marker);
    }, [marker]);*/

  return (
    <Map
      {...viewState}
      {...mapConfig}
      onMove={(event) => setViewState(event.viewState)}
      ref={mapRef}
      onLoad={handleMapLoad}
      onDblClick={(e) => {
        console.log("double click");
        console.log(e);
      }}
      onClick={(e) => {
        //console.log("click");
        console.log({lat: e.lngLat.lat, lng: e.lngLat.lng});

        setMarker((prevState) => {
          if (prevState.length > 0) {
            return [...prevState, {lat: e.lngLat.lat, lng: e.lngLat.lng}];
          }
          return [{lat: e.lngLat.lat, lng: e.lngLat.lng}];
        });

        // Check if the click is within any circle
        const clickPoint = {lat: e.lngLat.lat, lng: e.lngLat.lng};
        handleCircleClick(clickPoint);
      }}
    >
      {/* Render markers */}
      {marker.length > 0 &&
        marker.map((location, index) => (
          <Marker
            key={index}
            longitude={location.lng}
            latitude={location.lat}
            anchor={"center"}
          />
        ))}

      {/* Render GeoJSON Source and Layer */}
      <Source type="geojson" id="metrics-data" data={geoJson}>
        <Layer
          id="circle-layer"
          type="circle"
          paint={{
            "circle-radius": 50,
            "circle-color": ["get", "color"],
            "circle-opacity": 0.5,
          }}
        />
      </Source>
    </Map>
  );
};

const Location = memo(LocationPage);
export default Location;
