import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword as createUser } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSY9L7jKMT-Oej1ZGZ8SLx_lQZ5Y5MAsk",
  authDomain: "e-book-ce1a1.firebaseapp.com",
  projectId: "e-book-ce1a1",
  storageBucket: "e-book-ce1a1.appspot.com",
  messagingSenderId: "498408129870",
  appId: "1:498408129870:web:101c8a8321e741807f4a1f"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
// initialisation des services de firestore
const db = getFirestore(app);
// initialisation des services de firebase authentification
const auth = getAuth(app);

export { app, auth, db, createUser };