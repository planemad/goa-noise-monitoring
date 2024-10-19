import useSoundStore from "@/store/soundStore";
import { useEffect, useRef } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { SoundDataPoint } from "@/types/sound";
import useLocationStore from "@/store/locationStore";

const updateInterval: number = Number(
	process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_INTERVAL
);

export default function useMeasureSoundInDb() {
	const intervalIdRef = useRef<NodeJS.Timeout | undefined | null>(undefined);
	const {
		isRecording,
		setCurrentNoiseLevel,
		setAverageNoiseLevel,
		noiseLevels,
		setNoiseLevels,
		setIsRecording,
		averageNoiseLevel,
	} = useSoundStore();
	const { lat, lng } = useLocationStore();
	const noiseLevelsRef = useRef(noiseLevels);
	const { addData } = useFirestore<SoundDataPoint>("sound_data");

	const stopRecording = () => {
		setIsRecording(false);
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
			// setCurrentNoiseLevel(0);
			// setAverageNoiseLevel(0);
			// setNoiseLevels([]);
		}
	};

	useEffect(() => {
		if (!isRecording) {
			stopRecording();
		}
	}, [isRecording]);

	useEffect(() => {
		noiseLevelsRef.current = noiseLevels;
		if (
			noiseLevels.length ===
			Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE)
		) {
			addData({
				lat,
				lng,
				noiseLevel: averageNoiseLevel,
				timestamp: new Date().toISOString(),
			});
			stopRecording();
		}
	}, [noiseLevels]);

	useEffect(() => {
		let audioContext: AudioContext;
		let analyser: AnalyserNode;
		let dataArray: Float32Array;
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			alert("sound recording is not supported in this browser");
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

					setCurrentNoiseLevel(db);
					const updatedNoiseLevels = [...noiseLevelsRef.current, db];
					if (
						updatedNoiseLevels.length >
						Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE)
					) {
						updatedNoiseLevels.shift();
					}
					setNoiseLevels(updatedNoiseLevels);

					const avgNoise = Math.round(
						updatedNoiseLevels.reduce((a, b) => a + b, 0) /
							updatedNoiseLevels.length
					);
					setAverageNoiseLevel(avgNoise);
				}

				function startRecording() {
					if (
						noiseLevels.length ===
						Number(process.env.NEXT_PUBLIC_MEASUREMENT_SAMPLE_SIZE)
					) {
						setNoiseLevels([]);
						setAverageNoiseLevel(0);
					}
					if (!intervalIdRef.current) {
						intervalIdRef.current = setInterval(
							updateNoiseLevel,
							updateInterval
						);
					}
				}

				if (isRecording) {
					startRecording();
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
}
