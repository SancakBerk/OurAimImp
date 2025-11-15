import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import { serviceReturnType, userType } from "@/types/types";
export const getUserDataById = async ({
  userId,
}: {
  userId: string;
}): Promise<userType | null> => {
  const userCollection = collection(db, "users");
  const queryForUserCollection = query(
    userCollection,
    where("userId", "==", userId)
  );
  try {
    const snapShot = await getDocs(queryForUserCollection);
    if (snapShot.docs.length !== 1) {
      return null;
    }
    const userData = snapShot.docs[0].data() as userType;
    return userData;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
export const createUserService = async (
  userData: Omit<userType, "userId">
): Promise<serviceReturnType> => {
  try {
    // Kullanıcıyı oluştur
    const userRef = await addDoc(collection(db, "users"), userData);
    const userId = userRef.id;

    // userId'yi user document'ine ekle
    await setDoc(userRef, { ...userData, userId }, { merge: true });
    console.log('✅ User created with userId:', userId);

    // Kullanıcıya ait savings verisini oluştur
    const savingsRef = doc(db, "savings", userId);
    await setDoc(savingsRef, {
      userId,
      aimDate: Date.now(),
      totalSavings: {
        dollar: 0,
        euro: 0,
        fon: 0,
        gold14: 0,
        gold18: 0,
        gold22: 0,
        gold24: 0,
        hisse: 0,
        tl: 0,
      },
    });
    const perSavingsRef = collection(savingsRef, "perSavings");
    await addDoc(perSavingsRef, {});
    return {
      statusCode: 201,
      data: { userId },
      message: "User and savings created successfully",
    };
  } catch (error) {
    console.error("Error creating user and savings:", error);
    return {
      statusCode: 500,
      data: null,
      message: "Failed to create user and savings",
    };
  }
};
