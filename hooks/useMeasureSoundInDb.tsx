import { useState, useEffect, useRef } from "react";

export default function useNoiseLevel(
	updateInterval: number = 250,
	isRecording: boolean = true
) {
	const [noiseLevel, setNoiseLevel] = useState<number>(0);
	const intervalIdRef = useRef<NodeJS.Timeout | undefined | null>(undefined);

	useEffect(() => {
		let audioContext: AudioContext;
		let analyser: AnalyserNode;
		let dataArray: Float32Array;
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			alert("sound recording is not supported in this browser");
			return;
		}
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
				}

				function startRecording() {
					if (!intervalIdRef.current) {
						intervalIdRef.current = setInterval(
							updateNoiseLevel,
							updateInterval
						);
					}
				}

				function stopRecording() {
					if (intervalIdRef.current) {
						clearInterval(intervalIdRef.current);
						intervalIdRef.current = null;
						setNoiseLevel(0);
					}
				}

				if (isRecording) {
					startRecording();
				} else {
					stopRecording();
				}
			})
			.catch((error) => console.error("Error accessing microphone:", error));

		return () => {
			if (audioContext) {
				audioContext.close();
			}
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
				intervalIdRef.current = null;
			}
		};
	}, [updateInterval, isRecording]);

	return noiseLevel;
}
