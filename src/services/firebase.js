import { initializeApp } from 'firebase/app';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

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

// Enable offline persistence
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
} catch (e) {
  console.log("Persistence initialization skipped");
}

export { db, app };
