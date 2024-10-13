import { useState, useEffect } from "react";

export function useNoiseLevel(updateInterval: number = 250) {
	const [noiseLevel, setNoiseLevel] = useState<number>(0);

	useEffect(() => {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			alert("getUserMedia is not supported in this browser");
			return;
		}

		let audioContext: AudioContext;
		let analyser: AnalyserNode;
		let dataArray: Float32Array;
		let animationFrameId: number;

		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				audioContext = new AudioContext();
				analyser = audioContext.createAnalyser();
				const microphone = audioContext.createMediaStreamSource(stream);
				microphone.connect(analyser);
				analyser.fftSize = 2048;
				const bufferLength = analyser.frequencyBinCount;
				dataArray = new Float32Array(bufferLength);

				function updateNoiseLevel() {
					analyser.getFloatTimeDomainData(dataArray);
					let rms = 0;
					for (let i = 0; i < bufferLength; i++) {
						rms += dataArray[i] * dataArray[i];
					}
					rms = Math.sqrt(rms / bufferLength);

					let db = 20 * Math.log10(rms);
					db = Math.max(30, Math.min(90, db + 90));
					db = Math.round(db);
					setNoiseLevel(db);
					animationFrameId = requestAnimationFrame(updateNoiseLevel);
				}
				updateNoiseLevel();
			})
			.catch((error) => console.error("Error accessing microphone:", error));

		return () => {
			if (audioContext) {
				audioContext.close();
			}
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [updateInterval]);

	return noiseLevel;
}
