import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2rbc45Zys2uWplgPxc48tpn2ZwMtiHZQ",
  authDomain: "bold-intercontinental.firebaseapp.com",
  projectId: "bold-intercontinental",
  storageBucket: "bold-intercontinental.firebasestorage.app",
  messagingSenderId: "802474540768",
  appId: "1:802474540768:web:573e69ccf72b00c8529a85",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);