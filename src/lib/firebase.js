// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9lpz_-NqaimQrH5Jqbn6and7F-ooyntM",
  authDomain: "movie-app-42b60.firebaseapp.com",
  projectId: "movie-app-42b60",
  storageBucket: "movie-app-42b60.firebasestorage.app",
  messagingSenderId: "841740655264",
  appId: "1:841740655264:web:8dd0c6078165c7a8a187c5",
  measurementId: "G-QD0ELGC6LT"
};

// ⬇️ artık tüm alanlar dolu
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics sadece https://localhost veya https:// alan adında çalışır.
// İhtiyacınız yoksa yoruma alabilirsiniz.
export const analytics = getAnalytics(app);