import { create } from "zustand";

interface SoundStore {
	isRecording: boolean;
	currentNoiseLevel: number;
	averageNoiseLevel: number;
	remainingTime: number;
	noiseLevels: number[];
	setIsRecording: (isRecording: boolean) => void;
	setCurrentNoiseLevel: (level: number) => void;
	setAverageNoiseLevel: (level: number) => void;
	setNoiseLevels: (levels: number[]) => void;
}

const useSoundStore = create<SoundStore>((set) => ({
	isRecording: false,
	currentNoiseLevel: 0,
	averageNoiseLevel: 0,
	remainingTime: 10,
	noiseLevels: [],
	setIsRecording: (isRecording) => set({ isRecording }),
	setCurrentNoiseLevel: (level) => set({ currentNoiseLevel: level }),
	setAverageNoiseLevel: (level) => {
		set({
			averageNoiseLevel: level,
		});
	},
	setNoiseLevels: (levels) => set({ noiseLevels: levels }),
}));

export default useSoundStore;
