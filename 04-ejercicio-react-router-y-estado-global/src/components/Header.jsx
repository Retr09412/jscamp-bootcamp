import {Link} from "./Link";
import { useAuthStore } from "../store/authStore";
import { NavLink } from "react-router";

export function Header() {
  ///Funcion del boton de login/logout
  const HeaderUserButton = () => {
        const { isLoggedIn, login, logout } = useAuthStore();
        return isLoggedIn 
          ? <button className="header-auth-btn" onClick={logout}>Cerrar Sesión</button> 
          : <button className="header-auth-btn" onClick={login}>Iniciar Sesión</button>
      };
  
  return (
    <header>
      <Link href="/" style={{textDecoration: "none", color: "black"}}>
        <h1>CarJobs</h1>
      </Link>
      
      <nav>
      
        <NavLink to="/search"
          className={({ isActive }) => isActive ? "active" : ""}
        >Empleos</NavLink>
        <HeaderUserButton />
      </nav>
    </header>
  )
}