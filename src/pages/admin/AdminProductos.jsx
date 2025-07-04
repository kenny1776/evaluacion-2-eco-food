import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getProductos,
  updateProducto,
  deleteProducto,
  addProducto
} from "../../services/productoService";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: ""
  });

  const resetForm = () => {
    setFormData({ nombre: "", descripcion: "", precio: "" });
    setProductoActual(null);
  };

  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const handleGuardar = async () => {
    try {
      if (!formData.nombre || !formData.precio) {
        Swal.fire("Faltan datos", "Nombre y precio son obligatorios", "warning");
        return;
      }

      if (productoActual) {
        await updateProducto(productoActual.id, formData);
        Swal.fire("Actualizado", "Producto actualizado", "success");
      } else {
        await addProducto(formData);
        Swal.fire("Agregado", "Producto creado", "success");
      }

      setFormVisible(false);
      resetForm();
      cargarProductos();
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      await deleteProducto(id);
      cargarProductos();
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Productos</h3>

      <button
        className="btn btn-primary"
        onClick={() => {
          resetForm();
          setFormVisible(true);
        }}
      >
        Nuevo Producto
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>${p.precio}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setProductoActual(p);
                    setFormData(p);
                    setFormVisible(true);
                  }}
                >
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(p.id)}>
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
                  {productoActual ? "Editar Producto" : "Nuevo Producto"}
                </h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Precio"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
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
