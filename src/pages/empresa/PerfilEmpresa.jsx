import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getUserData, updateUsuario } from "../../services/userService";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PerfilEmpresa() {
  const navigate = useNavigate();
  const uid = getAuth().currentUser?.uid;

  const [datosEmpresa, setDatosEmpresa] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", ubicacion: "" });
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await getUserData(uid);
        setDatosEmpresa(datos);
        setFormData({
          nombre: datos.nombre || "",
          ubicacion: datos.ubicacion || ""
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire("Error", "No se pudo cargar la información", "error");
      }
    };

    if (uid) cargarDatos();
  }, [uid]);

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire("Faltan datos", "El nombre es obligatorio", "warning");
      return;
    }

    try {
      await updateUsuario(uid, formData, datosEmpresa.tipo); // usa colección detectada
      Swal.fire("Actualizado", "Datos actualizados correctamente", "success");
      setModoEdicion(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire("Error", "No se pudo actualizar la información", "error");
    }
  };

  if (!datosEmpresa) return <div className="container mt-4">Cargando perfil...</div>;

  return (
    <div className="container mt-4">
      {/* Navegación superior */}
      <nav className="mb-4">
        <button
          className={`btn me-2 ${window.location.pathname.includes("perfil") ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => navigate("/empresa/perfil")}
        >
          Perfil
        </button>
        <button
          className={`btn ${window.location.pathname.includes("productos") ? "btn-secondary" : "btn-outline-secondary"}`}
          onClick={() => navigate("/empresa/productos")}
        >
          Productos
        </button>
      </nav>

      <h3>Perfil Empresarial</h3>

      <div className="mt-3">
        <label className="form-label">Nombre</label>
        <input
          className="form-control mb-2"
          value={formData.nombre}
          maxLength={50}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          disabled={!modoEdicion}
        />

        <label className="form-label">Ubicación</label>
        <input
          className="form-control mb-2"
          value={formData.ubicacion}
          maxLength={100}
          onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
          disabled={!modoEdicion}
        />

        <label className="form-label">Correo</label>
        <input className="form-control mb-2" value={datosEmpresa.email || ""} disabled />

        <label className="form-label">RUT</label>
        <input className="form-control mb-3" value={datosEmpresa.rut || "No disponible"} disabled />

        {!modoEdicion ? (
          <button className="btn btn-warning" onClick={() => setModoEdicion(true)}>
            Editar perfil
          </button>
        ) : (
          <>
            <button className="btn btn-success me-2" onClick={handleGuardar}>
              Guardar cambios
            </button>
            <button className="btn btn-secondary" onClick={() => setModoEdicion(false)}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
