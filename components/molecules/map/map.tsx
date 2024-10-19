"use client";
import { useState, useEffect } from "react";
import {
	MapContainer,
	TileLayer,
	CircleMarker,
	Popup,
	useMap,
} from "react-leaflet";
import { LatLng, LocationEvent } from "leaflet";
// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "./styles.css";
import useLocationStore from "@/store/locationStore";
import { useFirestore } from "@/hooks/useFirestore";

const LocationMarker = () => {
	const [position, setPosition] = useState<LatLng | null>(null);
	const map = useMap();
	const { setLocation } = useLocationStore();
	const { data } = useFirestore("sound_data");

	console.log("data from firestore: ", data);

	useEffect(() => {
		map.locate().on("locationfound", function (e: LocationEvent) {
			setPosition(e.latlng);
			map.flyTo(e.latlng, map.getZoom());
			setLocation(e.latlng.lat, e.latlng.lng);
		});
	}, [map]);

	return position === null ? null : (
		<CircleMarker
			center={position}
			radius={8}
			className="pulsating-marker"
			pathOptions={{
				color: "blue",
				fillColor: "blue",
				fillOpacity: 0.7,
			}}
		>
			<Popup>You are here</Popup>
		</CircleMarker>
	);
};

const Map = () => {
	return (
		<MapContainer
			center={[15.5809308, 73.7448377]}
			zoom={15}
			scrollWheelZoom={false}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<LocationMarker />
		</MapContainer>
	);
};

export default Map;
