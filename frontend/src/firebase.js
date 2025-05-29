// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "hotel-management-system-5fa84.firebaseapp.com",
//   projectId: "hotel-management-system-b9c49",
//   storageBucket: "hotel-management-system-5fa84.appspot.com",
//   messagingSenderId: "388624998909",
//   appId: "1:388624998909:web:581157d5609b2256913994"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDcZUGVnTikcoGtv6eHy9Gd_Wdz5JEbJYY",
  authDomain: "hotel-management-system-b9c49.firebaseapp.com",
  projectId: "hotel-management-system-b9c49",
  storageBucket: "hotel-management-system-b9c49.firebasestorage.app",
  messagingSenderId: "716428286875",
  appId: "1:716428286875:web:1e21dbfdf2f7da34985f3e",
  measurementId: "G-YZM8FF09G4"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);