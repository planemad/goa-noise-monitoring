"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useSoundStore from "@/store/soundStore";
import { Progress } from "@/components/ui/progress";
import { PlayIcon, PauseIcon, ReloadIcon } from "@radix-ui/react-icons";

interface SoundMonitoringProps {
	isExpandBtmSheet: boolean;
	handleExpandBtmSheet: () => void;
	handleCollapseBtmSheet: () => void;
	handleExtendBottomSheet: () => void;
}

const SoundMonitoring: React.FC<SoundMonitoringProps> = ({
	isExpandBtmSheet,
	handleExpandBtmSheet,
	handleExtendBottomSheet,
}) => {
	const {
		currentNoiseLevel,
		averageNoiseLevel,
		isRecording,
		setIsRecording,
		noiseLevels,
	} = useSoundStore();

	const toggleRecording = () => {
		if (!isExpandBtmSheet) {
			handleExpandBtmSheet();
		}
		setIsRecording(!isRecording);
	};

	useEffect(() => {
		if (
			noiseLevels.length ===
			Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE)
		) {
			handleExtendBottomSheet();
		}
	}, [noiseLevels]);

	const getButtonText = () => {
		switch (true) {
			case noiseLevels.length ===
				Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE):
				return "Start new recording";
			case noiseLevels.length === 0:
				return "Start recording";
			case isRecording:
				return "Pause recording";
			default:
				return "Resume recording";
		}
	};

	const getMinNoiseLevel = () => {
		return Math.min(...noiseLevels);
	};

	const getMaxNoiseLevel = () => {
		return Math.max(...noiseLevels);
	};

	console.log(
		"condition: ",
		!isRecording &&
			noiseLevels.length > 0 &&
			noiseLevels.length <
				Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE)
	);

	return (
		<div className="p-4 flex flex-col items-center">
			{!isRecording && (
				<Button className="bg-black text-white" onClick={toggleRecording}>
					{isRecording ? <PauseIcon /> : <PlayIcon />}
					{getButtonText()}
				</Button>
			)}

			<div className="flex flex-col items-center mb-[12px] mt-[16px]">
				{isRecording && (
					<>
						<p className="text-sm text-center text-gray-500 font-semibold">
							current sound level
						</p>
						<p className="text-2xl font-bold text-center mb-4">
							{currentNoiseLevel} dB
						</p>
					</>
				)}
			</div>

			{noiseLevels.length !==
				Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE) &&
				isRecording && (
					<div className="w-full">
						<p className="text-sm text-center text-gray-500 mb-[4px]">
							analyzing{" "}
							<ReloadIcon className="ml-1 h-4 w-4 animate-spin inline-block" />
						</p>
						<Progress
							value={
								Math.round(
									(noiseLevels.length /
										Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE)) *
										100
								) || 0
							}
						/>
					</div>
				)}
			{noiseLevels.length ===
				Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE) && (
				<div>
					{" "}
					<p className="text-sm text-center text-gray-500 font-semibold">
						average sound level
					</p>
					<p className="text-3xl font-bold text-center mb-4">
						{averageNoiseLevel} dB
					</p>
					<p className="text-sm text-center text-gray-500">min sound level</p>
					<p className="text-lg font-bold text-center mb-4">
						{getMinNoiseLevel()} dB
					</p>
					<p className="text-sm text-center text-gray-500">max sound level</p>
					<p className="text-lg font-bold text-center mb-4">
						{getMaxNoiseLevel()} dB
					</p>
				</div>
			)}
		</div>
	);
};

export default SoundMonitoring;
