"use client";

import React, { useState } from "react";
import useMeasureSoundInDb from "@/hooks/useMeasureSoundInDb";
import { Button } from "@/components/ui/button";

const SoundMonitoring: React.FC = () => {
	const [isRecording, setIsRecording] = useState(true);
	const noiseLevel = useMeasureSoundInDb(250, isRecording);

	const toggleRecording = () => {
		setIsRecording(!isRecording);
	};

	return (
		<div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
			<h2 className="text-xl font-semibold mb-2 text-center">Sound Level</h2>
			<div className="text-3xl font-bold text-center mb-4">{noiseLevel} dB</div>
			<Button
				onClick={toggleRecording}
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
			>
				{isRecording ? "Pause" : "Resume"} Recording
			</Button>
		</div>
	);
};

export default SoundMonitoring;
