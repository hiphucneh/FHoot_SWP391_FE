// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTD2xMG4_5szX1yKVx9V9HWLJ9Tn9h9_c",
  authDomain: "kahoot-clone-1057c.firebaseapp.com",
  projectId: "kahoot-clone-1057c",
  storageBucket: "kahoot-clone-1057c.appspot.com",
  messagingSenderId: "771006964772",
  appId: "1:771006964772:web:d51611cee5e6f8e74024b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);
export default app;
