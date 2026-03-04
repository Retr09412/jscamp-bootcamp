// src/components/JobCard.jsx
import { useState } from "react";

function JobCard({ titulo, empresa, ubicacion, descripcion, nivel }) {
  const[isApplied, setIsApplied] = useState(false);

  const handleApplyClick = () => {
    setIsApplied(true);
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job';
  const buttonText = isApplied ? "Aplicado!" : "Aplicar";

  return (
    <article 
    className="job-listing-card"
    >
      <div>
        <h3>{titulo}</h3>
        <small>{empresa} | {ubicacion} | {nivel}</small>
        <p>{descripcion}</p>
      </div>
      <button className={buttonClasses} onClick={handleApplyClick}>{buttonText}</button> 
    </article>
  )
}

export function ContainerJobs( {jobs} ) {
  return (
    <div className="jobs-listings">
      {jobs.map((job) => (
        <JobCard 
        key={job.id} 
        titulo={job.titulo}
        empresa={job.empresa}
        ubicacion={job.ubicacion}
        descripcion={job.descripcion}
        //Data attributes -->
        modalidad={job.data.modalidad}
        nivel={job.data.nivel}
        tecnologia={job.data.tecnologia}
        />
      ))}
    </div>
  );
}

