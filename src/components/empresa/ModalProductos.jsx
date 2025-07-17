import { useEffect } from "react";
import { addProducto, updateProducto } from "../../services/productoService";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

export default function AddProductos({
  show,
  setShow,
  userData,
  handleRefresh,
  formData,
  setFormData
}) {
  useEffect(() => {
    if (formData.vencimiento) {
      const hoy = new Date();
      const fechaVenc = new Date(formData.vencimiento);
      const dias = Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24));
      if (dias <= 3 && dias >= 0) {
        Swal.fire("Advertencia", "Este producto vence en 3 días o menos", "warning");
      }
    }
  }, [formData.vencimiento]);

  const guardarProducto = async (e) => {
    e.preventDefault();

    const hoy = new Date().toISOString().split("T")[0];
    if (!formData.nombre.trim() || formData.precio === "") {
      Swal.fire("Faltan datos", "Nombre y precio son obligatorios", "warning");
      return;
    }

    if (formData.vencimiento < hoy) {
      Swal.fire("Fecha inválida", "La fecha de vencimiento no puede ser anterior a hoy", "error");
      return;
    }

    const productoFinal = {
      ...formData,
      empresaId: userData.uid,
      precio: parseFloat(formData.precio),
      cantidad: parseInt(formData.cantidad),
      estado: formData.estado || "activo"
    };

    try {
      if (formData.id) {
        await updateProducto(formData.id, productoFinal);
        Swal.fire("Actualizado correctamente", "", "success");
      } else {
        await addProducto(productoFinal);
        Swal.fire("Agregado correctamente", "", "success");
      }
      handleRefresh();
      setShow(false);
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo guardar el producto", "error");
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>{formData.id ? "Editar" : "Agregar"} Producto</Modal.Title>
      </Modal.Header>
      <form onSubmit={guardarProducto}>
        <Modal.Body>
          <input
            className="form-control mb-2"
            placeholder="Nombre"
            maxLength={50}
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="Descripción"
            maxLength={200}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Cantidad"
            min={0}
            max={10000}
            value={formData.cantidad || ""}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
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
          <input
            type="date"
            className="form-control mb-2"
            min={new Date().toISOString().split("T")[0]}
            value={formData.vencimiento}
            onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })}
            required
          />
          <select
            className="form-select mb-2"
            value={formData.estado || "activo"}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>
            Cerrar
          </button>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
