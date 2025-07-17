import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getProductos,
  updateProducto,
  deleteProducto,
  addProducto
} from "../../services/productoService";
import { getAuth } from "firebase/auth";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    vencimiento: "",
    cantidad: "",
    precio: "",
    estado: "activo"
  });
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const empresaId = getAuth().currentUser?.uid;

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      vencimiento: "",
      cantidad: "",
      precio: "",
      estado: "activo"
    });
    setProductoActual(null);
  };

  const cargarProductos = async () => {
    const data = await getProductos();
    const propios = data.filter(p => p.empresaId === empresaId);
    setProductos(propios);
  };

  const handleGuardar = async () => {
    const { nombre, precio, vencimiento } = formData;
    const hoy = new Date();
    const fechaVencimiento = new Date(vencimiento);

    if (!nombre.trim() || precio === "") {
      Swal.fire("Faltan datos", "Nombre y precio son obligatorios", "warning");
      return;
    }

    if (fechaVencimiento < hoy) {
      Swal.fire("Fecha inválida", "La fecha de vencimiento no puede ser anterior a hoy", "error");
      return;
    }

    if ((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24) <= 3) {
      Swal.fire("Advertencia", "Este producto vence en 3 días o menos", "warning");
    }

    const productoFinal = {
      ...formData,
      empresaId,
      precio: parseFloat(formData.precio),
      cantidad: parseInt(formData.cantidad)
    };

    try {
      if (productoActual) {
        await updateProducto(productoActual.id, productoFinal);
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
      } else {
        await addProducto(productoFinal);
        Swal.fire("Agregado", "Producto creado correctamente", "success");
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

  const productosFiltrados = productos
    .filter(p => filtroEstado === "todos" || p.estado === filtroEstado)
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="container mt-4">
      <h3>Gestión de Productos</h3>

      <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setFormVisible(true);
          }}
        >
          Nuevo Producto
        </button>

        <select
          className="form-select w-auto"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>

        <input
          className="form-control w-50"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Vencimiento</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.vencimiento}</td>
              <td>{p.cantidad}</td>
              <td>{p.precio === 0 ? "Gratuito" : `$${p.precio}`}</td>
              <td>{p.estado}</td>
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
        <div className="modal d-block bg-dark bg-opacity-50">
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
                  maxLength={50}
                  required
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value.trimStart() })}
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  maxLength={200}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value.trimStart() })}
                />

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Cantidad"
                  min={0}
                  max={10000}
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={formData.vencimiento}
                  min={new Date().toISOString().split("T")[0]} // Establece el mínimo como hoy
                  required
                  onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })}
                />

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Precio"
                  min={0}
                  max={100000}
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                />

                <select
                  className="form-select mb-2"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
