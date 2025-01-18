// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwOcapKK8JmI2pQdVPGD7xVPgWLBhRH8E",
  authDomain: "retro-board-2f8d3.firebaseapp.com",
  projectId: "retro-board-2f8d3",
  storageBucket: "retro-board-2f8d3.firebasestorage.app",
  messagingSenderId: "645404749196",
  appId: "1:645404749196:web:0d24fed4e2c6821f2cbaa9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
