// src/lib/signup.js

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const signUpWithUsername = async (email, password, username) => {
  try {
    // Check if username is taken
    const usernameQuery = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      throw new Error("Username already taken");
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Save user data to Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      username,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
