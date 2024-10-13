"use client";

import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import("./map"), {
	ssr: false,
	loading: () => <p>Loading...</p>,
});

function MapCaller() {
	return (
		<div className="h-full w-full">
			<LazyMap />
		</div>
	);
}

export default MapCaller;
