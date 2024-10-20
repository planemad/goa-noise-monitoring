"use client";
import { useState, useEffect } from "react";
import {
	MapContainer,
	TileLayer,
	CircleMarker,
	Popup,
	useMap,
	Marker,
} from "react-leaflet";
import { LatLng, LocationEvent } from "leaflet";
// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "./styles.css";
import useLocationStore from "@/store/locationStore";
import { useFirestore } from "@/hooks/useFirestore";
import tzlookup from "tz-lookup";

const LocationMarker = () => {
	const [position, setPosition] = useState<LatLng | null>(null);
	const map = useMap();
	const { setLocation } = useLocationStore();

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
	const { data } = useFirestore("sound_data");

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
			{data &&
				data.map((point) => (
					<Marker key={point.id} position={[point.lat, point.lng]}>
						<Popup>
							Noise Level: {point.noiseLevel} dB
							<br />
							Time:{" "}
							{new Date(point.timestamp).toLocaleString("en-GB", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
								timeZone: tzlookup(point.lat, point.lng),
							})}
						</Popup>
					</Marker>
				))}
		</MapContainer>
	);
};

export default Map;
