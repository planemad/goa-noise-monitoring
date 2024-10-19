"use client";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

const clientCredentials = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp: FirebaseApp | undefined;
let firestore: Firestore | undefined;

export const getFirebaseApp = (): FirebaseApp => {
	if (firebaseApp) return firebaseApp;

	if (!getApps().length) {
		firebaseApp = initializeApp(clientCredentials);
		if (typeof window !== "undefined" && "measurementId" in clientCredentials) {
			getAnalytics(firebaseApp);
		}
	} else {
		firebaseApp = getApps()[0];
	}

	return firebaseApp;
};

export const getFirebaseFirestore = (): Firestore => {
	if (!firestore) {
		const app = getFirebaseApp();
		firestore = getFirestore(app);
	}
	return firestore;
};
