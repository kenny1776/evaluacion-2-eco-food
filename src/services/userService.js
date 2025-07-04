import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

/**
 * Obtiene los datos de un usuario por su UID
 * @param {string} uid
 * @returns {Promise<object>}
 */
export const getUserData = async (uid) => {
  if (!uid) throw new Error("UID no proporcionado");

  const ref = doc(db, "usuarios", uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Usuario no encontrado en Firestore");
  }

  return snapshot.data();
};

/**
 * Guarda datos del usuario autenticado en Firestore
 * @param {string} uid
 * @param {object} data
 * @returns {Promise<void>}
 */
export const saveUserData = async (uid, data) => {
  if (!uid || !data) throw new Error("UID o datos no proporcionados");

  await setDoc(doc(db, "usuarios", uid), data);
};

/**
 * Obtiene usuarios por tipo (ej: "admin", "cliente")
 * @param {string} tipo
 * @returns {Promise<array>}
 */
export const getUsuariosPorTipo = async (tipo) => {
  const ref = collection(db, "usuarios");
  const q = query(ref, where("tipo", "==", tipo));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Actualiza datos de un usuario
 * @param {string} id
 * @param {object} data
 * @returns {Promise<void>}
 */
export const updateUsuario = async (id, data) => {
  await updateDoc(doc(db, "usuarios", id), data);
};

/**
 * Elimina un usuario de Firestore
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteUsuario = async (id) => {
  await deleteDoc(doc(db, "usuarios", id));
};
