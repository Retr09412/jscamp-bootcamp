import {Link} from "./Link";
export function Header() {
  return (
    <header>
      <Link href="/" style={{textDecoration: "none", color: "black"}}>
        <h1>CarJobs</h1>
      </Link>
      
      <nav>
      
        <Link href="search">Empleos</Link>
        <Link href="#">Empresas</Link>
        <Link href="#">Salarios</Link>
      </nav>
    </header>
  )
}