import React, { useState, useEffect } from "react";

import ReactMapGL, { Marker } from "react-map-gl";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { MAP_KEY, REACT_APP_BACKEND_URL } from "../../secrets.json";

const ClusterMap = () => {
    const [places, setPlaces] = useState([
        { id: 1, location: { lat: 52.508153, lng: 13.451806 } },
        { id: 2, location: { lat: 52.498698, lng: 13.356478 } },
    ]);
    const { sendRequest } = useHttpClient();
    const [viewport, setViewport] = useState({
        latitude: 52.508153,
        longitude: 13.451806,
        width: "100vw",
        height: "80vh",
        zoom: 10,
    });
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    REACT_APP_BACKEND_URL + `/places/all`
                );
                setPlaces(responseData.places);
            } catch (err) {}
        };

        fetchPlaces();
    }, []);

    return (
        <ReactMapGL
            {...viewport}
            // maxZoom={20}
            mapboxApiAccessToken={MAP_KEY}
            onViewportChange={(newViewport) => {
                setViewport({ ...newViewport });
            }}
        >
            {places.map((place) => (
                <Marker
                    key={place.id}
                    latitude={place.location.lat}
                    longitude={place.location.lng}
                >
                    <img
                        src={
                            "https://lakelandescaperoom.com/wp-content/uploads/2019/11/google-map-icon-transparent-19.png"
                        }
                        width={"25px"}
                        height={"25px"}
                        alt={"geocach location"}
                    />
                </Marker>
            ))}
        </ReactMapGL>
    );
};
export default ClusterMap;
