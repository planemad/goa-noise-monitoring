import { create } from "zustand";

interface LocationStore {
	lat: number;
	lng: number;
	setLocation: (lat: number, lng: number) => void;
}

const useLocationStore = create<LocationStore>((set) => ({
	lat: 0,
	lng: 0,
	setLocation: (lat, lng) => set({ lat, lng }),
}));

export default useLocationStore;
