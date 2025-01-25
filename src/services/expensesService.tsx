import { db } from "@/lib/firebaseconfig";
import {
  expensesDataWithDocumentId,
  expensesType,
  serviceReturnType,
} from "@/types/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";

export const getUserExpensesByUserId = async (
  userId: string
): Promise<serviceReturnType> => {
  var expensesCollection = collection(db, "expenses");
  var queryForExpensesCollection = query(
    expensesCollection,
    where("userId", "==", userId)
  );
  try {
    var snapshot = (await getDocs(
      queryForExpensesCollection
    )) as QuerySnapshot<DocumentData>;

    var allExpenses = snapshot.docs.map((eachExpenseData) => {
      return {
        ...eachExpenseData.data(),
        documentId: eachExpenseData.id,
      } as expensesDataWithDocumentId;
    });
    return { statusCode: 200, message: "sucess", data: allExpenses };
  } catch (error) {
    console.log("error", error);
    return { statusCode: 500, message: "Error" };
  }
};

export const addExpense = async (
  expenseData: expensesType
): Promise<serviceReturnType> => {
  const expenseCollectionRef = collection(db, "expenses");
  try {
    await addDoc(expenseCollectionRef, expenseData);
    return { statusCode: 200, message: "Added Successfully" };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, message: "Error" };
  }
};
export const deleteExpensesByDocumentId = async (
  documentId: string
): Promise<serviceReturnType> => {
  try {
    await deleteDoc(doc(db, "expenses", documentId));
    return { statusCode: 200, message: "Deleted Successfully" };
  } catch (error) {
    console.log("error", error);
    return { statusCode: 500, message: "Error" };
  }
};

export const updateExpenseDataByDocumentId = async (
  documentId: string,
  updatedExpenseData: expensesType
): Promise<serviceReturnType> => {
  try {
    await updateDoc(doc(db, "expenses", documentId), updatedExpenseData);
    return { statusCode: 200, message: "Updated Successfully" };
  } catch (error) {
    console.log("error", error);
    return { statusCode: 500, message: "Error" };
  }
};
