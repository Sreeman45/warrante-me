import {  getAuth,
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup
} from "firebase/auth";

import { FC, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { name } from "../App";
import { firebaseapp } from "../utils/utils";


const auth = getAuth(firebaseapp);

const provider: GoogleAuthProvider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive.file"); 

const Googlesignup: FC = () => {
  const context = useContext(name);
  if (!context) {
    return <div>Context is not available!</div>;
  }
  const { setNickname } = context;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        setLoading(true);
        const savedNickname = localStorage.getItem("nickname");
        if (savedNickname) {
          setNickname(savedNickname);
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            const userName = user.displayName ?? "";
            setNickname(userName);
            localStorage.setItem("nickname", userName);
            navigate("/");
          } else {
            setNickname("");
            localStorage.removeItem("nickname");
            navigate('/signup')
          }
          setLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, [navigate]);

  const putData = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/drive.file"); 
  
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
  
      if (!credential) {
        throw new Error("No credential found");
      }
  
      const accessToken = credential.accessToken;
      if (!accessToken) {
        throw new Error("No access token received.");
      }
  
      
      localStorage.setItem("googleAccessToken", accessToken);
      console.log("✅ New Access Token:", accessToken);
    } catch (error) {
      console.error("❌ Sign-in failed:", error);
    }
  };

  return (
    <main className="flex h-screen justify-center items-center">
      {loading ? (
        <div className="font-semibold text-2xl text-blue-400">Loading...</div>
      ) : (
        <button
          onClick={putData}
          className="px-4 py-2 text-2xl border-[1.5px] text-blue-500 border-gray-500 font-semibold rounded cursor-pointer hover:bg-blue-100"
        >
          Sign In with Google
        </button>
      )}
    </main>
  );
};

export default Googlesignup;
