import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const tipo = "cliente"; // Fijo como cliente

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

      await saveUserData(cred.user.uid, {
        uid: cred.user.uid,
        nombre,
        email,
        tipo: "cliente",
        direccion,
        comuna,
        telefono
      });


      Swal.fire("Registro exitoso", "Verifica tu correo para poder iniciar sesión.", "success");
      navigate("/login");

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input type="text" className="form-control" value={nombre}
            onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input type="email" className="form-control" value={email}
            onChange={(e) => setEmail(e.target.value)} required 
            maxLength={60}/>
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={password}
            onChange={(e) => setPassword(e.target.value)} required 
            maxLength={30}/>
          <div className="form-text">Debe tener mínimo 6 caracteres, con letras y números.</div>
        </div>

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

        <button type="submit" className="btn btn-success">Registrar</button>

        <button
        type="button"
        className="btn btn-link mt-3"
        onClick={() => navigate("/login")} >
        ¿Tienes cuenta?
        </button>

      </form>
    </div>
  );
}
