import Map from "@/components/molecules/map/index";
import SoundMonitoring from "./components/sound-monitoring";
export default function Home() {
	return (
		<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
			<div className="w-screen h-screen">
				<SoundMonitoring />
				<Map />
			</div>
		</main>
	);
}
