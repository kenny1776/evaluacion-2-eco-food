import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function Register() {
  const [tipo, setTipo] = useState("cliente"); // Selector de tipo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [rut, setRut] = useState("");

  const navigate = useNavigate();

  const validarPassword = (pass) =>
    pass.length >= 6 && /[a-zA-Z]/.test(pass) && /\d/.test(pass);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarPassword(password)) {
      Swal.fire("Contraseña insegura", "Debe tener mínimo 6 caracteres, letras y números.", "warning");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);

      const baseData = {
        uid: cred.user.uid,
        nombre,
        email,
        tipo
      };

      const extraData =
        tipo === "cliente"
          ? { direccion, comuna, telefono }
          : { ubicacion, rut };

      await saveUserData(cred.user.uid, {
        ...baseData,
        ...extraData
      });

      Swal.fire("Registro exitoso", "Verifica tu correo para iniciar sesión.", "success");
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>

      {/* Selector de tipo */}
      <div className="mb-3">
        <label className="form-label">Tipo de usuario</label>
        <select
          className="form-select"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="cliente">Cliente</option>
          <option value="empresa">Empresa</option>
        </select>
      </div>

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input type="text" className="form-control" value={nombre}
            onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input type="email" className="form-control" value={email}
            onChange={(e) => setEmail(e.target.value)} required maxLength={60} />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={password}
            onChange={(e) => setPassword(e.target.value)} required maxLength={30} />
          <div className="form-text">Debe tener mínimo 6 caracteres, con letras y números.</div>
        </div>

        {/* Campos específicos para cliente */}
        {tipo === "cliente" && (
          <>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input type="text" className="form-control" value={direccion}
                onChange={(e) => setDireccion(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Comuna</label>
              <input type="text" className="form-control" value={comuna}
                onChange={(e) => setComuna(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono (opcional)</label>
              <input type="text" className="form-control" value={telefono}
                onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </>
        )}

        {/* Campos específicos para empresa */}
        {tipo === "empresa" && (
          <>
            <div className="mb-3">
              <label className="form-label">Ubicación</label>
              <input type="text" className="form-control" value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">RUT</label>
              <input type="text" className="form-control" value={rut}
                onChange={(e) => setRut(e.target.value)} required />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-success">Registrar</button>

        <button
          type="button"
          className="btn btn-link mt-3"
          onClick={() => navigate("/login")}
        >
          ¿Tienes cuenta?
        </button>
      </form>
    </div>
  );
}
