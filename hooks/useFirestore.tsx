import { useState, useEffect } from "react";
import {
	collection,
	query,
	onSnapshot,
	doc,
	setDoc,
	addDoc,
	DocumentData,
	QuerySnapshot,
	Query,
} from "firebase/firestore";
import { getFirebaseFirestore } from "../utils/firebase";

export function useFirestore<T extends DocumentData>(collectionName: string) {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const firestore = getFirebaseFirestore();

	useEffect(() => {
		const q = query(collection(firestore, collectionName)) as Query<T>;
		const unsubscribe = onSnapshot(
			q,
			{},
			(querySnapshot: QuerySnapshot<T>) => {
				const documents = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setData(documents as T[]);
				setLoading(false);
			},
			(error: Error) => {
				setError(error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [collectionName]);

	const addData = async (newData: T) => {
		try {
			const docRef = await addDoc(
				collection(firestore, collectionName),
				newData
			);
			return docRef.id;
		} catch (error) {
			console.error("Error adding document: ", error);
			throw error;
		}
	};

	const updateData = async (id: string, updatedData: Partial<T>) => {
		try {
			const docRef = doc(firestore, collectionName, id);
			await setDoc(docRef, updatedData, { merge: true });
		} catch (error) {
			console.error("Error updating document: ", error);
			throw error;
		}
	};

	return { data, loading, error, addData, updateData };
}
