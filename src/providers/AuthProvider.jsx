import { auth } from "@/firebase/firebase.init";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import {
   createUserWithEmailAndPassword,
   GithubAuthProvider,
   GoogleAuthProvider,
   onAuthStateChanged,
   signInWithEmailAndPassword,
   signInWithPopup,
   signOut,
   updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
   const axiosPublic = useAxiosPublic();
   const [user, setUser] = useState(null);
   const [authLoading, setAuthLoading] = useState(true);
   const signUpWithEmail = (email, password) => {
      setAuthLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
   };
   const signInWithEmail = (email, password) => {
      setAuthLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
   };
   const updateUserProfile = (obj) => {
      setAuthLoading(true);
      updateProfile(auth.currentUser, obj);
   };
   const signInWithGoogle = () => {
      setAuthLoading(true);
      return signInWithPopup(auth, googleProvider);
   };
   const signInWithGithub = () => {
      setAuthLoading(true);
      return signInWithPopup(auth, githubProvider);
   };
   const signOutUser = () => {
      return signOut(auth);
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         setUser(currentUser);
         if (currentUser) {
            const { data } = await axiosPublic.post("/jwt", {
               email: currentUser.email,
            });
            if (data.token) {
               localStorage.setItem("access_token", data.token);
            }
         } else {
            localStorage.removeItem("access_token");
         }
         // console.log(currentUser);
         setAuthLoading(false);
      });
      return () => unsubscribe();
   }, []);
   const AuthData = {
      signUpWithEmail,
      signInWithEmail,
      updateUserProfile,
      signInWithGoogle,
      signInWithGithub,
      user,
      authLoading,
      signOutUser,
      setAuthLoading,
   };

   return (
      <AuthContext.Provider value={AuthData}> {children}</AuthContext.Provider>
   );
};

export default AuthProvider;
