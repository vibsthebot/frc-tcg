import { initializeApp } from 'firebase/app';
import { FIREBASE_API_KEY } from '@env';
import { initializeAuth, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "frc-tcg.firebaseapp.com",
  projectId: "frc-tcg",
  storageBucket: "frc-tcg.firebasestorage.app",
  messagingSenderId: "855647199254",
  appId: "1:855647199254:web:8b404d193e76e1d2c11537",
  measurementId: "G-WJJ845DMSE"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
export const db = getFirestore(app);
export { auth };