import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteProducto } from "../../services/productoService";
import TablaProductos from "../../components/empresa/TablaProductos";
import ModalProductos from "../../components/empresa/ModalProductos";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Productos() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [ordenNombre, setOrdenNombre] = useState(null);
  const [ordenPrecio, setOrdenPrecio] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [refreshTick, setRefreshTick] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    cantidad: 0,
    vencimiento: "",
    estado: "activo",
    empresaId: userData?.uid || "",
    id: null
  });

  const handleRefresh = () => {
    setRefreshTick((t) => t + 1);
  };

  const eliminar = useCallback(async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Eliminar producto?",
        icon: "warning",
        showCancelButton: true
      });
      if (confirm.isConfirmed) {
        await deleteProducto(id);
        handleRefresh();
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  }, []);

  const abrirModal = (producto = null) => {
    if (producto) {
      setFormData({ ...producto });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        cantidad: 0,
        vencimiento: "",
        estado: "activo",
        empresaId: userData?.uid || "",
        id: null
      });
    }
    setShowModal(true);
  };

  const cerrarSesion = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <div className="container mt-4">
        {/* Navegación superior */}
        <nav className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate("/empresa/perfil")}>
              Ir a Perfil Empresarial
            </button>
          </div>
          <div>
            <button className="btn btn-danger" onClick={cerrarSesion}>
              Cerrar sesión
            </button>

          </div>
        </nav>

        <h3>Gestión de Productos</h3>

        <div className="row g-3 align-items-end mt-2">
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => abrirModal()}>
              Agregar Producto
            </button>
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              type="search"
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="por_vencer">Por vencer (≤3 días)</option>
              <option value="vencido">Vencidos</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={ordenNombre || ""}
              onChange={(e) => setOrdenNombre(e.target.value || null)}
            >
              <option value="">— Ordenar por nombre —</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={ordenPrecio || ""}
              onChange={(e) => setOrdenPrecio(e.target.value || null)}
            >
              <option value="">— Ordenar por precio —</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>
          </div>

          <div className="col-md-2">
            <button className="btn btn-outline-success w-100" onClick={handleRefresh}>
              <i className="fa-solid fa-arrows-rotate"></i> Actualizar
            </button>
          </div>
        </div>

        <div className="mt-4">
          <TablaProductos
            key={refreshTick}
            busqueda={busqueda}
            estadoFiltro={estadoFiltro}
            ordenNombre={ordenNombre}
            ordenPrecio={ordenPrecio}
            pageSize={pageSize}
            userData={userData}
            eliminar={eliminar}
            abrirModal={abrirModal}
          />
        </div>
      </div>

      <ModalProductos
        id="productoModal"
        show={showModal}
        setShow={setShowModal}
        userData={userData}
        formData={formData}
        setFormData={setFormData}
        abrirModal={abrirModal}
        handleRefresh={handleRefresh}
      />
    </>
  );
}
