import { useAuth } from "../../../context/AuthContext";
import CerrarSesion from "../../../components/CerrarSesion";
import { Link } from "react-router-dom";

export default function NavAdmin() {
  const { userData } = useAuth();
  console.log("✅ NavAdmin cargado");

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin">
          Ecofood {userData?.nombre ? `- ${userData.nombre}` : ""}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/admin/productos">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/admin/usuarios">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/admin/administradores">
                Administradores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/admin/empresas">
                Empresas
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
          
            <span className="navbar-text">
              <CerrarSesion />
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

