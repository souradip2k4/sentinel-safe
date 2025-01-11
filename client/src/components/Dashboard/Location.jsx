import {useState, useMemo, useRef, useCallback, memo, useEffect} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {Marker, Map, Source, Layer} from "react-map-gl";
import haversine from "haversine-distance";
import useStore from "@/zustand/store";
import {auth} from "@/firebase.config";
import {useShallow} from "zustand/react/shallow";
import toast from "react-hot-toast";

/*const metrics1 = [
  {
    "id": "b3f74919-854c-41f0-a257-83b52125618b",
    "areaRating": 3,
    "GeoCode": {
      "campusName": "Campus 12",
      "latitude": "20.349806588028613",
      "longitude": "85.81989800796583"
    }
  },
  {
    "id": "6d59a4aa-e1dd-4f08-824e-06650cb04d89",
    "areaRating": 4,
    "GeoCode": {
      "campusName": "Campus 3",
      "latitude": "20.359060790552633",
      "longitude": "85.82273042068533"
    }
  },
  {
    "id": "765972a4-d1de-4384-b49d-79588d729a21",
    "areaRating": 4.2,
    "GeoCode": {
      "campusName": "Campus 15",
      "latitude": "20.3589803216163",
      "longitude": "85.81232344970715"
    }
  },
  {
    "id": "7bf93858-53ad-4342-9779-3bb2b07cdc95",
    "areaRating": 4.5,
    "GeoCode": {
      "campusName": "Campus 18",
      "latitude": "20.354554465549313",
      "longitude": "85.82202231750614"
    }
  },
  {
    "id": "d2a2624b-15a3-44fd-b096-08e45d266e92",
    "areaRating": 3.5,
    "GeoCode": {
      "campusName": "Campus 14",
      "latitude": "20.353950929892974",
      "longitude": "85.81313884124859"
    }
  },
  {
    "id": "7c491f54-bea7-495e-8526-fe8200eaba30",
    "areaRating": 4,
    "GeoCode": {
      "campusName": "Campus 7",
      "latitude": "20.35648576379556",
      "longitude": "85.8157352195741"
    }
  },
  {
    "id": "5a92ef9a-ad2c-4d71-8f56-01f834e8cf70",
    "areaRating": 3.5,
    "GeoCode": {
      "campusName": "Campus 25",
      "latitude": "20.3505912049731",
      "longitude": "85.81599271164026"
    }
  }
]*/

const LocationPage = () => {
  const {metrics, fetchLocationMatrix, fetchUserReviews, reviews, setGeoCodeId} = useStore(useShallow((state) => ({
    metrics: state.metrics,
    fetchLocationMatrix: state.fetchLocationMatrix,
    fetchUserReviews: state.fetchUserReviews,
    reviews: state.reviews,
    setGeoCodeId: state.setGeoCodeId
  })));

  useEffect(() => {
    (async function () {
      try {
        const authToken = await auth.currentUser.getIdToken(true);
        await fetchLocationMatrix(authToken);
      } catch (e) {
        toast.error(e.message);
      }
      const authToken = await auth.currentUser.getIdToken(true);
      fetchLocationMatrix(authToken);
    })();

  }, [fetchLocationMatrix]);

  // console.log(metrics);
  const features = metrics.map((item) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [parseFloat(item.GeoCode.longitude), parseFloat(item.GeoCode.latitude)],
    },
    properties: {
      geoCodeId: item.GeoCode.geoCodeId,
      campusName: item.GeoCode.campusName,
      color: "#4ade80",
      areaRating: item.areaRating
    },
  }));

  const geoJson = useMemo(
    () => ({
      type: "FeatureCollection",
      features,
    }),
    []
  );

  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: 85.81855690345947
    ,
    latitude: 20.35421246229845,
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

  const handleCircleClick = useCallback(async (clickPoint) => {
    const CIRCLE_RADIUS = 110; // Radius in meters
    let isCircleClicked = false;

    for (let feature of features) {
      const {geometry, properties} = feature;
      const circleCenter = {
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      };

      if (isClickInCircle(clickPoint, circleCenter, CIRCLE_RADIUS)) {
        isCircleClicked = true;
        console.log("Circle clicked:", properties.campusName, circleCenter, properties.geoCodeId);

        try {
          const userId = await auth.currentUser.getIdToken(true);
          setGeoCodeId(properties.geoCodeId);
          await fetchUserReviews(userId, properties.geoCodeId, properties.campusName);
          // console.log(reviews);
        } catch (error) {
          toast.error(error.message);
        }

        break; // Exit the loop once a match is found
      }
    }

    if (!isCircleClicked) {
      // Only trigger error if no circles match the click
      toast.error("User reviews and location matrix for this area is currently unavailable");
    }
  }, [features, fetchUserReviews, reviews]);


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
            "circle-color": [
              "case",
              [">=", ["get", "areaRating"], 3.5], "#4ade80",
              [">=", ["get", "areaRating"], 2.5], "#facc15",
              [">=", ["get", "areaRating"], 1.5], "#f97316",
              "#dc2626"
            ],
            "circle-opacity": 0.5,
          }}
        />
      </Source>
    </Map>
  );
};

const Location = memo(LocationPage);
export default Location;
