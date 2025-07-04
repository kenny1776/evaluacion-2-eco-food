import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const EMPRESA_COLLECTION = "empresas";

/**
 * Trae todas las empresas
 */
export const getEmpresas = async () => {
  const snapshot = await getDocs(collection(db, EMPRESA_COLLECTION));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Agrega una empresa
 */
export const addEmpresa = async (data) => {
  return await addDoc(collection(db, EMPRESA_COLLECTION), data);
};

/**
 * Actualiza una empresa
 */
export const updateEmpresa = async (id, data) => {
  const ref = doc(db, EMPRESA_COLLECTION, id);
  return await updateDoc(ref, data);
};

/**
 * Elimina una empresa
 */
export const deleteEmpresa = async (id) => {
  const ref = doc(db, EMPRESA_COLLECTION, id);
  return await deleteDoc(ref);
};
