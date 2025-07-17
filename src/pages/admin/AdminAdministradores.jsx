import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getUsuariosPorTipo,
  updateUsuario,
  deleteUsuario
} from "../../services/userService";


export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [adminActual, setAdminActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: ""
  });

  const resetForm = () => {
    setFormData({ nombre: "", email: "" });
    setAdminActual(null);
  };

  const cargarAdmins = async () => {
    const data = await getAdministradores();
    setAdmins(data);
  };

  const handleGuardar = async () => {
    try {
      if (!formData.nombre || !formData.email) {
        Swal.fire("Faltan datos", "Nombre y correo son obligatorios", "warning");
        return;
      }

      await updateUsuario(adminActual.id, formData);

      Swal.fire("Actualizado", "Administrador actualizado correctamente", "success");
      setFormVisible(false);
      resetForm();
      cargarAdmins();
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      await deleteUsuario(id);
      cargarAdmins();
      Swal.fire("Eliminado", "Administrador eliminado correctamente", "success");
    }
  };

  useEffect(() => {
  getUsuariosPorTipo("admin").then(setAdmins);
}, []);


  return (
    <div className="container mt-4">
      <h3>Administradores registrados</h3>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.email}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setAdminActual(a);
                    setFormData({ ...a });
                    setFormVisible(true);
                  }}
                >
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(a.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {formVisible && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Editar Administrador</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setFormVisible(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleGuardar}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}