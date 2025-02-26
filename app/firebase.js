// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNCkYKl44br-SoAjejCepmuyst_mTfr4E",
  authDomain: "expense-tracker-a59de.firebaseapp.com",
  projectId: "expense-tracker-a59de",
  storageBucket: "expense-tracker-a59de.firebasestorage.app",
  messagingSenderId: "34203288628",
  appId: "1:34203288628:web:d086a61ba247529909f661"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);