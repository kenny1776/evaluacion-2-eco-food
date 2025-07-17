import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { secondaryAuth, db } from "../../services/firebase";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [empresaActual, setEmpresaActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    ubicacion: "",
    rut: ""
  });

  const cargarEmpresas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "empresas"));
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmpresas(datos);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
      Swal.fire("Error", "No se pudieron cargar las empresas", "error");
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      ubicacion: "",
      rut: ""
    });
    setEmpresaActual(null);
  };

  const handleGuardar = async () => {
    const { nombre, email, password, ubicacion, rut } = formData;

    if (!nombre.trim() || !email.trim()) {
      Swal.fire("Faltan datos", "Nombre y correo son obligatorios", "warning");
      return;
    }

    try {
      if (empresaActual) {
        const ref = doc(db, "empresas", empresaActual.id);
        await updateDoc(ref, {
          nombre,
          email,
          ubicacion,
          rut
        });

        const usuarioRef = doc(db, "usuarios", empresaActual.id);
        await updateDoc(usuarioRef, {
          nombre,
          email
        });

        Swal.fire("Actualizado", "Empresa actualizada correctamente", "success");
      } else {
        const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        await sendEmailVerification(cred.user);

        const empresaRef = doc(db, "empresas", cred.user.uid);
        await setDoc(empresaRef, {
          nombre,
          email,
          ubicacion,
          rut,
          id: cred.user.uid
        });

        const usuarioRef = doc(db, "usuarios", cred.user.uid);
        await setDoc(usuarioRef, {
          nombre,
          email,
          tipo: "empresa"
        });

        Swal.fire(
          "Empresa registrada",
          "Se ha enviado un correo de verificación. La empresa debe verificar su correo antes de iniciar sesión.",
          "success"
        );
      }

      setFormVisible(false);
      resetForm();
      cargarEmpresas();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("Error", error.message || "No se pudo guardar la empresa", "error");
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
      try {
        await deleteDoc(doc(db, "empresas", id));
        await deleteDoc(doc(db, "usuarios", id));
        Swal.fire("Eliminada", "Empresa eliminada correctamente", "success");
        cargarEmpresas();
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire("Error", "No se pudo eliminar la empresa", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Empresas registradas</h3>

      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => {
          resetForm();
          setFormVisible(true);
        }}>
          Registrar nueva empresa
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Ubicación</th>
            <th>RUT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map(e => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.email}</td>
              <td>{e.ubicacion}</td>
              <td>{e.rut}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEmpresaActual(e);
                    setFormData({
                      nombre: e.nombre || "",
                      email: e.email || "",
                      password: "",
                      ubicacion: e.ubicacion || "",
                      rut: e.rut || ""
                    });
                    setFormVisible(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminar(e.id)}
                >
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
                  {empresaActual ? "Editar Empresa" : "Registrar Empresa"}
                </h5>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleGuardar();
              }}>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={formData.nombre}
                    maxLength={50}
                    required
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Correo electrónico"
                    type="email"
                    value={formData.email}
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={empresaActual}
                  />
                  {!empresaActual && (
                    <input
                      className="form-control mb-2"
                      placeholder="Contraseña"
                      type="password"
                      value={formData.password}
                      required
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  )}
                  <input
                    className="form-control mb-2"
                    placeholder="Ubicación"
                    value={formData.ubicacion}
                    maxLength={100}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="RUT"
                    value={formData.rut}
                    pattern="^\d{1,2}\.\d{3}\.\d{3}-[\dkK]{1}$"
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setFormVisible(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
