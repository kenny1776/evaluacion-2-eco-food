import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getEmpresas,
  addEmpresa,
  updateEmpresa,
  deleteEmpresa
} from "../../services/empresaFirebase";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [empresaActual, setEmpresaActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    razonSocial: "",
    email: ""
  });

  const resetForm = () => {
    setFormData({ nombre: "", rut: "", razonSocial: "", email: "" });
    setEmpresaActual(null);
  };

  const cargarEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
  };

  const handleGuardar = async () => {
    try {
      if (!formData.nombre || !formData.rut || !formData.email) {
        Swal.fire("Campos incompletos", "Nombre, RUT y email son obligatorios", "warning");
        return;
      }

      if (empresaActual) {
        await updateEmpresa(empresaActual.id, formData);
        Swal.fire("Actualizado", "Empresa actualizada correctamente", "success");
      } else {
        await addEmpresa(formData);
        Swal.fire("Registrada", "Empresa creada exitosamente", "success");
      }

      setFormVisible(false);
      resetForm();
      cargarEmpresas();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      await deleteEmpresa(id);
      cargarEmpresas();
      Swal.fire("Eliminada", "Empresa eliminada correctamente", "success");
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Empresas Registradas</h3>

      <button
        className="btn btn-primary"
        onClick={() => {
          resetForm();
          setFormVisible(true);
        }}
      >
        Nueva Empresa
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Razón Social</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.rut}</td>
              <td>{e.razonSocial}</td>
              <td>{e.email}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEmpresaActual(e);
                    setFormData(e);
                    setFormVisible(true);
                  }}
                >
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(e.id)}>
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
                <h5 className="modal-title">
                  {empresaActual ? "Editar Empresa" : "Nueva Empresa"}
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
                  placeholder="RUT"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Razón Social"
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Correo electrónico"
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
