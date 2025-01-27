import { db } from "@/lib/firebaseconfig";
import {
  serviceReturnType,
  totalSavingsType,
  totalSavingTypeWithDocumentId,
} from "@/types/types";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";

export const getTotalSavingDataById = async (
  userId: string
): Promise<serviceReturnType> => {
  const savingsCollection = collection(db, "savings");
  const queryForSavingsCollection = query(
    savingsCollection,
    where("userId", "==", userId)
  );
  try {
    const snapshot = (await getDocs(
      queryForSavingsCollection
    )) as QuerySnapshot<DocumentData>;

    const allSavings = snapshot.docs.map((eachSavingData) => {
      return {
        ...(eachSavingData.data() as totalSavingsType),
        documentId: eachSavingData.id,
      } as totalSavingTypeWithDocumentId;
    });

    return { statusCode: 200, message: "sucess", data: allSavings };
  } catch (error) {
    console.log("error", error);
    return { statusCode: 500, message: "Error" };
  }
};

export const UpdateTotalSavingsData = async (
  documentId: string,
  updatedData: totalSavingsType
): Promise<serviceReturnType> => {
  const savingsCollectionRef = collection(db, "savings");
  try {
    await updateDoc(doc(savingsCollectionRef, documentId), updatedData);
    return { statusCode: 200, message: "Added Successfully" };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, message: "Error" };
  }
};
