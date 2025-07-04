import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// Obtener todos los usuarios con tipo "cliente"
export const getClientes = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Agregar un nuevo cliente a la colección "usuarios"
export const addCliente = async (clienteData) => {
  return await addDoc(collection(db, "usuarios"), {
    ...clienteData,
    tipo: "cliente"
  });
};

// Actualizar los datos de un cliente específico
export const updateCliente = async (id, clienteData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, clienteData);
};

// Eliminar un cliente por ID
export const deleteCliente = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};
