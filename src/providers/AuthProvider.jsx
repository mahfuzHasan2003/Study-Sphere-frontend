import { auth } from "@/firebase/firebase.init";
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
      setAuthLoading(true);
      return signOut(auth);
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
         console.log(currentUser);
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
