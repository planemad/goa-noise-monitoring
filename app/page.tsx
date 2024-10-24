"use client";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useState, useRef } from "react";
import Map from "@/components/molecules/map/index";
import SoundMonitoring from "./components/sound-monitoring";
import useMeasureSoundInDb from "@/hooks/useMeasureSoundInDb";

export default function Home() {
	useMeasureSoundInDb();
	const [isExpandBtmSheet, setIsExpandBtmSheet] = useState(false);
	const sheetRef = useRef<SheetRef>(null);

	const handleExpandBtmSheet = () => {
		setIsExpandBtmSheet(true);
		sheetRef.current?.snapTo(1);
	};

	const handleCollapseBtmSheet = () => {
		setIsExpandBtmSheet(false);
		sheetRef.current?.snapTo(2);
	};

	const handleExtendBottomSheet = () => {
		setIsExpandBtmSheet(true);
		sheetRef.current?.snapTo(0);
	};

	return (
		<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
			<div className="w-screen h-screen">
				<Map />
				<Sheet
					ref={sheetRef}
					isOpen={true}
					snapPoints={[300, 200, 70]}
					initialSnap={2}
					onClose={() => {}}
					disableDrag
				>
					<Sheet.Container>
						<Sheet.Content>
							<SoundMonitoring
								isExpandBtmSheet={isExpandBtmSheet}
								handleExpandBtmSheet={handleExpandBtmSheet}
								handleCollapseBtmSheet={handleCollapseBtmSheet}
								handleExtendBottomSheet={handleExtendBottomSheet}
							/>
						</Sheet.Content>
					</Sheet.Container>
				</Sheet>
			</div>
		</main>
	);
}
