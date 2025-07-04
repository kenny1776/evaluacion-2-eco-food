import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { saveUserData } from "./userService";

/**
 * Registra un usuario cliente y guarda su información en Firestore
 * @param {object} formData - { email, password, nombre, comuna }
 */
export const registrarClienteConAuth = async ({ email, password, nombre, comuna }) => {
  const credenciales = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credenciales.user.uid;

  await saveUserData(uid, {
    email,
    nombre,
    comuna,
    tipo: "cliente"
  });
};
