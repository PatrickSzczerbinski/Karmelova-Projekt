// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Konfiguracja Firebase aplikacji internetowej
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'karmelova-project.firebaseapp.com',
	projectId: 'karmelova-project',
	storageBucket: 'karmelova-project.appspot.com',
	messagingSenderId: '473656002316',
	appId: '1:473656002316:web:3f901edfc8574f182feb29',
}

// Inicjalizacja Firebase
export const app = initializeApp(firebaseConfig)
