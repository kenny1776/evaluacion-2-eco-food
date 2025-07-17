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
 * Obtiene los datos de un usuario por su UID buscando en múltiples colecciones
 * @param {string} uid
 * @returns {Promise<object>}
 */
export const getUserData = async (uid) => {
  if (!uid) throw new Error("UID no proporcionado");

  const colecciones = ["usuarios", "empresas", "administradores"];
  for (const nombre of colecciones) {
    const ref = doc(db, nombre, uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return {
        ...snapshot.data(),
        tipo: snapshot.data().tipo || nombre,
        id: uid
      };
    }
  }

  throw new Error("Usuario no encontrado en Firestore");
};

/**
 * Guarda datos del usuario autenticado en Firestore
 * @param {string} uid
 * @param {object} data
 * @param {string} coleccion - "usuarios" o "empresas"
 * @returns {Promise<void>}
 */
export const saveUserData = async (uid, data, coleccion = "usuarios") => {
  if (!uid || !data) throw new Error("UID o datos no proporcionados");

  await setDoc(doc(db, coleccion, uid), data);
};

/**
 * Obtiene usuarios por tipo desde la colección "usuarios"
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
 * Actualiza datos de un usuario en la colección indicada
 * @param {string} id
 * @param {object} data
 * @param {string} coleccion
 * @returns {Promise<void>}
 */
export const updateUsuario = async (id, data, coleccion = "usuarios") => {
  await updateDoc(doc(db, coleccion, id), data);
};

/**
 * Elimina un usuario de Firestore desde la colección indicada
 * @param {string} id
 * @param {string} coleccion
 * @returns {Promise<void>}
 */
export const deleteUsuario = async (id, coleccion = "usuarios") => {
  await deleteDoc(doc(db, coleccion, id));
};

/**
 * Obtiene todos los documentos de una colección
 * @param {string} coleccion
 * @returns {Promise<array>}
 */
export const getTodos = async (coleccion = "usuarios") => {
  const ref = collection(db, coleccion);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
