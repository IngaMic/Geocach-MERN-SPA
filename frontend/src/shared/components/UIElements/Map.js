import React from "react";

import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import { MAP_KEY } from "../../../secrets.json";
const Page = ReactMapboxGl({
    accessToken: MAP_KEY,
});

const Map = (props) => {
    const { center } = props;
    const lat = center.lat;
    const lng = center.lng;

    return (
        <Page
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
                height: "100%",
                width: "100%",
            }}
            center={[lng, lat]}
            zoom={[14]}
        >
            <Marker coordinates={[lng, lat]} anchor="bottom">
                <img
                    src={
                        "https://lakelandescaperoom.com/wp-content/uploads/2019/11/google-map-icon-transparent-19.png"
                    }
                    width={"25px"}
                    height={"25px"}
                    alt={"geocach location"}
                />
            </Marker>
            <Layer
                type="symbol"
                id="marker"
                layout={{ "icon-image": "marker-15" }}
            >
                <Feature coordinates={[lng, lat]} />
            </Layer>
        </Page>
    );
};

export default Map;
