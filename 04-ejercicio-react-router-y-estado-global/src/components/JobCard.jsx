import { useState } from "react";
import { useFavoritesStore } from "../store/favoritesStore";
// Cambiamos el link de `react-router` por el nuestro.
import { Link } from "./Link";

// El store ahora solo guarda los IDs de favorites
function JobCard({ id, titulo, empresa, ubicacion, descripcion, nivel }) {
  const [isApplied, setIsApplied] = useState(false);

  // const isLo = useAuthStore((state) => state.isLoggedIn);
  // const favoritos = useFavoritesStore((state) => state.favorites);
  // const toggleFavorito = useFavoritesStore((state) => state.toggleFavorite);
  // const empleoActual = { id, titulo, empresa, ubicacion, descripcion, nivel, modalidad, tecnologia };
  // const esFavorito = (favoritos || []).some((fav) => fav.id === id);

  // Como solo guardamos los IDs, solo hace falta pedir el valor y crear la acción
  const isFavorite = useFavoritesStore((state) => state.favorites.includes(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const handleApplyClick = () => {
    setIsApplied(true);
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job';
  const buttonText = isApplied ? "Aplicado!" : "Aplicar";

  return (
    <article className="job-listing-card">
      <div>
        <Link href={`/detail/${id}`}> <h3>{titulo}</h3> </Link>
        <small>{empresa} | {ubicacion} | {nivel}</small>
        <p>{descripcion}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
      <button className={buttonClasses} onClick={handleApplyClick}>
        {buttonText}
      </button> 
      
      {/* No hace falta que haya sesión */}
      <button 
        onClick={() => toggleFavorite(id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      </div>
    </article>
  )
}

export function ContainerJobs( {jobs} ) {
  return (
    <div className="jobs-listings">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          id={job.id}
          titulo={job.titulo}
          empresa={job.empresa}
          ubicacion={job.ubicacion}
          descripcion={job.descripcion}
          // Usamos el signo ? por seguridad por si algún empleo no tiene data
          modalidad={job.data?.modalidad}
          nivel={job.data?.nivel}
          tecnologia={job.data?.tecnologia}
        />
      ))}
    </div>
  );
}