import React, { useRef, useEffect } from "react";
// import mapboxgl from "mapbox-gl";
// mapboxgl.accessToken =
//     "pk.eyJ1IjoiZGFuaWVsbXVycGh5IiwiYSI6ImNranR2MXljcTA5MHIyd281cTFrMjF0YmYifQ.-QXpFJdrgYchVUxbdAF8Aw";
// import "./Map.css";

const Map = (props) => {
    const mapRef = useRef();

    const { center, zoom } = props;

    useEffect(() => {
        // const map = new window.google.maps.Map(mapRef.current, {
        //   center: center,
        //   zoom: zoom
        // });
        // new window.google.maps.Marker({ position: center, map: map });
        // const map = new mapboxgl.Map({
        //     container: "map",
        //     style: "mapbox://styles/mapbox/dark-v10",
        //     center: center,
        //     zoom: zoom,
        // });
        // new mapboxgl.Marker()
        //     .setLngLat(center)
        //     .addTo(map)
        //     .setPopup(
        //         new mapboxgl.Popup({ offset: 25 })
        //         //.setHTML()
        //     )
        //     .addTo(map);
    }, [center, zoom]);

    return (
        <div
            ref={mapRef}
            className={`map ${props.className}`}
            // style={props.style}
            id="map"
            style="width: 400px; height: 300px"
        ></div>
    );
};

export default Map;
