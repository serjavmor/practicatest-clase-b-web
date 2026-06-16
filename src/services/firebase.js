import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "practicatest-kuro-podium",
  appId: "1:828315360593:web:2ec269b1f162cde7940770",
  storageBucket: "practicatest-kuro-podium.firebasestorage.app",
  apiKey: "AIzaSyD67_xsYyTNvB_d5bYz5VXe7k4Pkb3W_mI",
  authDomain: "practicatest-kuro-podium.firebaseapp.com",
  messagingSenderId: "828315360593"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db, app };
