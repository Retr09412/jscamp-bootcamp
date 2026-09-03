import { NavLink } from "react-router";
import { useAuthStore } from "../store/authStore";
import { Link } from "./Link";

export function Header() {
  // Un componente definido dentro de otro se recrea en cada render y se desmonta/remonta asi que podemos usar el store directamente en el header para que se re-renderice solo cuando cambia el login.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  
  return (
    <header>
      <Link href="/" style={{textDecoration: "none", color: "black"}}>
        <h1>CarJobs</h1>
      </Link>
      
      <nav>
        {/* Pasamos el Link a NavLink para que se resalte cunado estamos en ese path */}
        <NavLink to="/search"
          className={({ isActive }) => isActive ? "active" : ""}
        >Empleos</NavLink>

        {isLoggedIn 
          ? <button className="header-auth-btn" onClick={logout}>Cerrar Sesión</button> 
          : <button className="header-auth-btn" onClick={login}>Iniciar Sesión</button>}
      </nav>
    </header>
  )
}