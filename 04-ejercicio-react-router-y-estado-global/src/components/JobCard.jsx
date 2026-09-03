import { useState } from "react";
import { Link } from "react-router"; 
import { useFavoritesStore } from "../store/favoritesStore";
import { useAuthStore } from "../store/authStore";

function JobCard({ id, titulo, empresa, ubicacion, descripcion, nivel, modalidad, tecnologia }) {
  const [isApplied, setIsApplied] = useState(false);

  
  const isLo = useAuthStore((state) => state.isLoggedIn);


  const favoritos = useFavoritesStore((state) => state.favorites); 
  const toggleFavorito = useFavoritesStore((state) => state.toggleFavorite); 


  const empleoActual = { 
    id, titulo, empresa, ubicacion, descripcion, nivel, modalidad, tecnologia 
  };

const esFavorito = (favoritos || []).some((fav) => fav.id === id);

  const handleApplyClick = () => {
    setIsApplied(true);
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job';
  const buttonText = isApplied ? "Aplicado!" : "Aplicar";

  return (
    <article className="job-listing-card">
      <div>
        <Link to={`/detail/${id}`}> <h3>{titulo}</h3> </Link>
        <small>{empresa} | {ubicacion} | {nivel}</small>
        <p>{descripcion}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
      <button className={buttonClasses} onClick={handleApplyClick}>
        {buttonText}
      </button> 
      
      <button 
        onClick={() => toggleFavorito(empleoActual)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
      >
        {(esFavorito && isLo) ? '❤️' : '🤍'}
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