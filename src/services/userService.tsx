import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import { userType } from "@/types/types";

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
