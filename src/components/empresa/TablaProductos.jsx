import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  obtenerTotalProductos,
  getProductosByEmpresaPagina,
  PAGE_SIZE
} from "../../services/productoService";

TablaProductos.propTypes = {
  userData: PropTypes.object,
  busqueda: PropTypes.string,
  estadoFiltro: PropTypes.string,
  ordenNombre: PropTypes.string,
  ordenPrecio: PropTypes.string,
  pageSize: PropTypes.number,
  eliminar: PropTypes.func.isRequired,
  abrirModal: PropTypes.func.isRequired
};

export default function TablaProductos({
  userData,
  busqueda,
  estadoFiltro,
  ordenNombre,
  ordenPrecio,
  pageSize = PAGE_SIZE,
  eliminar,
  abrirModal
}) {
  const [total, setTotal] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [productos, setProductos] = useState([]);
  const [sinMas, setSinMas] = useState(false);

  useEffect(() => {
    if (!userData) return;
    const fetchTotal = async () => {
      const cantidad = await obtenerTotalProductos(userData.uid, busqueda);
      setTotal(cantidad);
    };
    fetchTotal();
  }, [userData, busqueda]);

  useEffect(() => {
    const cargarPagina = async () => {
      let cursor = pagina > 0 ? historial[pagina - 1] || null : null;
      const { productos: nuevos, lastVisible } = await getProductosByEmpresaPagina(
        userData.uid,
        cursor,
        busqueda,
        pageSize
      );

      // Filtro de estado extendido
      const filtrados = nuevos.filter((p) => {
        if (estadoFiltro === "todos") return true;
        if (estadoFiltro === "por_vencer") {
          const dias = (new Date(p.vencimiento) - new Date()) / (1000 * 60 * 60 * 24);
          return dias <= 3 && dias >= 0;
        }
        if (estadoFiltro === "vencido") {
          return new Date(p.vencimiento) < new Date();
        }
        return p.estado === estadoFiltro;
      });

      // Ordenamiento
      const ordenados = [...filtrados].sort((a, b) => {
        if (ordenNombre) {
          return ordenNombre === "asc"
            ? a.nombre.localeCompare(b.nombre)
            : b.nombre.localeCompare(a.nombre);
        }
        if (ordenPrecio) {
          return ordenPrecio === "asc"
            ? a.precio - b.precio
            : b.precio - a.precio;
        }
        return 0;
      });

      setProductos(ordenados);
      setHistorial((prev) => {
        const copia = [...prev];
        copia[pagina] = lastVisible;
        return copia;
      });
      setSinMas(nuevos.length < pageSize);
    };

    if (userData) {
      cargarPagina();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, userData, busqueda, estadoFiltro, ordenNombre, ordenPrecio, pageSize]);

  return (
    <div className="row">
      <div className="col-12">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
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
            {productos.map((p, i) => {
              const diasRestantes = Math.ceil((new Date(p.vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
              const advertencia = diasRestantes <= 3 && diasRestantes >= 0;

              return (
                <tr key={i} className={advertencia ? "table-warning" : ""}>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.vencimiento}</td>
                  <td>{p.cantidad}</td>
                  <td>{p.precio === 0 ? "Gratuito" : `$${p.precio}`}</td>
                  <td>{p.estado}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => abrirModal(p)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
            {productos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted">No hay productos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="col-12 d-flex justify-content-between align-items-center">
        <p>Total de productos: {total}</p>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${pagina < 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPagina((p) => p - 1)}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            </li>
            <li className={`page-item ${sinMas ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPagina((p) => p + 1)}>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
