import { db } from "@/lib/firebaseconfig";
import {
  perSavingsType,
  serviceReturnType,
  totalSavingsType,
  totalSavingTypeWithDocumentId,
} from "@/types/types";
import {
  addDoc,
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
  updatedAllData: totalSavingsType,
  updatedPerSavings: perSavingsType[]
): Promise<serviceReturnType> => {
  const savingsCollectionRef = collection(db, "savings");
  try {
    await updateDoc(doc(savingsCollectionRef, documentId), updatedAllData);
    const perSavingsCollectionRef = collection(
      doc(savingsCollectionRef, documentId),
      "perSavings"
    );
    updatedPerSavings.map(async (each: perSavingsType) => {
      await addDoc(perSavingsCollectionRef, each);
    });

    return { statusCode: 200, message: "Added Successfully" };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, message: "Error" };
  }
};
export const getPerSavingsByUserId = async (
  userId: string
): Promise<serviceReturnType> => {
  try {
    // "savings" koleksiyonundaki tüm dokümanları al
    const savingsCollectionRef = collection(db, "savings");
    const perSavingsQuery = query(
      savingsCollectionRef,
      where("userId", "==", userId) // Kullanıcı ID'sine göre filtreleme
    );

    const querySnapshot = await getDocs(perSavingsQuery);
    const perSavingsData: perSavingsType[] = [];

    for (const doc of querySnapshot.docs) {
      // Her dökümanın altındaki 'perSavings' koleksiyonunu al
      const perSavingsCollectionRef = collection(doc.ref, "perSavings");
      const perSavingsSnapshot = await getDocs(perSavingsCollectionRef);

      perSavingsSnapshot.forEach((perSavingDoc) => {
        perSavingsData.push({
          ...(perSavingDoc.data() as perSavingsType),
        });
      });
    }

    return {
      statusCode: 200,
      message: "Success",
      data: perSavingsData as perSavingsType[],
    };
  } catch (error) {
    console.error("Error fetching perSavings data:", error);
    return {
      message: "Error fetching perSavings data",
      statusCode: 500,
    };
  }
};
export async function updateAimDate(
  userId: string,
  newAimDate: number
): Promise<serviceReturnType> {
  try {
    const savingsCollection = collection(db, "savings");
    const savingsQuery = query(
      savingsCollection,
      where("userId", "==", userId)
    );
    const snapshot = (await getDocs(
      savingsQuery
    )) as QuerySnapshot<DocumentData>;

    if (snapshot.empty) {
      return { statusCode: 404, message: "Kullanıcıya ait kayıt bulunamadı" };
    }

    const firstDoc = snapshot.docs[0];
    const docRef = doc(db, "savings", firstDoc.id);

    await updateDoc(docRef, { aimDate: newAimDate });

    return { statusCode: 200, message: "AimDate güncellendi" };
  } catch (error) {
    console.error("Error updating AimDate:", error);
    return { statusCode: 500, message: "AimDate güncelleme hatası" };
  }
}
