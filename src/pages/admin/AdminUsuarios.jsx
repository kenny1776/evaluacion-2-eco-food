import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  updateCliente,
  deleteCliente
} from "../../services/clienteFirebase";
import { registrarClienteConAuth } from "../../services/authService";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    password: ""
  });

  const resetFormulario = () => {
    setFormData({ nombre: "", email: "", comuna: "", password: "" });
    setClienteActual(null);
  };

  const cargarClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  const handleGuardar = async () => {
    try {
      if (!formData.nombre || !formData.email || !formData.comuna) {
        Swal.fire("Datos incompletos", "Por favor completa todos los campos", "warning");
        return;
      }

      if (clienteActual) {
        await updateCliente(clienteActual.id, {
          nombre: formData.nombre,
          email: formData.email,
          comuna: formData.comuna
        });
        Swal.fire("Actualizado", "Cliente actualizado con éxito", "success");
      } else {
        if (!formData.password || formData.password.length < 6) {
          Swal.fire("Contraseña inválida", "Debe tener al menos 6 caracteres", "warning");
          return;
        }
        await registrarClienteConAuth(formData);
        Swal.fire("Creado", "Cliente registrado con éxito", "success");
      }

      setFormVisible(false);
      resetFormulario();
      cargarClientes();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      await deleteCliente(id);
      cargarClientes();
      Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Clientes Registrados</h3>

      <button
        className="btn btn-primary"
        onClick={() => {
          resetFormulario();
          setFormVisible(true);
        }}
      >
        Nuevo Cliente
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.comuna}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setClienteActual(c);
                    setFormData({ ...c, password: "" });
                    setFormVisible(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminar(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {formVisible && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {clienteActual ? "Editar Cliente" : "Nuevo Cliente"}
                </h5>
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
                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                />
                {!clienteActual && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                )}
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
