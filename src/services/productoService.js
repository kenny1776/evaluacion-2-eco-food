import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export const getProductos = async () => {
  const snapshot = await getDocs(collection(db, "productos"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addProducto = async (data) => {
  return await addDoc(collection(db, "productos"), data);
};

export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  return await updateDoc(ref, data);
};

export const deleteProducto = async (id) => {
  const ref = doc(db, "productos", id);
  return await deleteDoc(ref);
};
