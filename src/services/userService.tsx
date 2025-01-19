import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import {
  expensesDataWithDocumentId,
  expensesType,
  savingsType,
  savingsTypeWithDocumentId,
  userType,
} from "@/types/types";

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
  const snapShot = await getDocs(queryForUserCollection);
  if (snapShot.docs.length !== 1) {
    return null;
  }
  const userData = snapShot.docs[0].data() as userType;
  return userData;
};

export const getUserTotalSavingDataById = async ({
  userId,
}: {
  userId: string;
}): Promise<savingsTypeWithDocumentId[]> => {
  const userDocRef = doc(db, "users", userId);

  const savingCollectionRef = collection(userDocRef, "orders");

  const snapshot = await getDocs(savingCollectionRef);
  const savings = snapshot.docs.map((doc) => ({
    documentId: doc.id,
    ...(doc.data() as savingsType),
  }));
  return savings;
};

export const getUserExpensesByUserId = async (
  userId: string
): Promise<expensesDataWithDocumentId[]> => {
  var expensesCollection = collection(db, "expenses");
  var queryForExpensesCollection = query(
    expensesCollection,
    where("userId", "==", userId)
  );
  var snapshot = (await getDocs(
    queryForExpensesCollection
  )) as QuerySnapshot<DocumentData>;

  var allExpenses = snapshot.docs.map((eachExpenseData) => {
    return {
      ...eachExpenseData.data(),
      documentId: eachExpenseData.id,
    } as expensesDataWithDocumentId;
  });
  return allExpenses;
};

export const updateExpense = async (
  documentId: string,
  expenseData: expensesType
) => {
  const expenseCollectionRef = doc(db, "expenses", documentId);
  updateDoc(expenseCollectionRef, expenseData);
};

export const addExpense = async (expenseData: expensesType) => {
  const expenseCollectionRef = collection(db, "expenses");
  await addDoc(expenseCollectionRef, expenseData);
};
export const deleteExpensesByDocumentId = async (documentId: string) => {
  await deleteDoc(doc(db, "expenses", documentId));
};
