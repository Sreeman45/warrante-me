import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey:import.meta.env.VITE_API_apiKey,
    authDomain:import.meta.env.VITE_API_authDomain ,
    databaseURL:import.meta.env.VITE_API_databaseURL ,
    projectId:import.meta.env.VITE_API_projectId ,
    storageBucket:import.meta.env.VITE_API_storageBucket ,
    messagingSenderId:import.meta.env.VITE_API_messagingSenderId ,
    appId:import.meta.env.VITE_API_appId ,
    measurementId:import.meta.env.VITE_API_measurementId
  };
  console.log(firebaseConfig)
  export const firebaseapp=initializeApp(firebaseConfig)
  export const auth = getAuth(firebaseapp)