import { create } from "zustand";

type DbDataPoint = {
	lat: number;
	lng: number;
	noiseLevel: number;
	timestamp: string;
};

interface DatabaseStore {
	dbData: DbDataPoint[];
	setDbData: (data: DbDataPoint) => void;
}

const useDatabaseStore = create<DatabaseStore>((set) => ({
	dbData: [],
	setDbData: (data) => set((state) => ({ dbData: [...state.dbData, data] })),
}));

export default useDatabaseStore;
