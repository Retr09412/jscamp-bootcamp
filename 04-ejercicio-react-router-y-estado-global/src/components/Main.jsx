import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { SearchFormSection } from "./SearchFormSection.jsx";
import { ContainerJobs } from "./JobCard.jsx";
import { Pagination } from "./Pagination.jsx";


const RESULTS_PER_PAGE = 5;

// Esta función lee la URL de arriba antes de que la página cargue


export function Main() {
  // Memoria central
  const [jobs, setJobs] = useState([]); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  
  // Usamos la función para que el estado inicial no esté vacío sino que nazca con lo que diga la URL
  const [filters, setFilters] = useState({
    textBuscador: searchParams.get('text') || '',
    technology: searchParams.get('technology') || '',
    location: searchParams.get('type') || '',
    experienceLevel: searchParams.get('level') || ''
  });

  // Función para usar api con filtros
  const fetchJobsFromAPI = async (filtrosActuales) => {
    setLoading(true); 
    try {
      const params = new URLSearchParams();

      // Parte de filter
      if (filtrosActuales.textBuscador) params.append('text', filtrosActuales.textBuscador);
      if (filtrosActuales.technology) params.append('technology', filtrosActuales.technology);
      if (filtrosActuales.location) params.append('type', filtrosActuales.location);
      if (filtrosActuales.experienceLevel) params.append('level', filtrosActuales.experienceLevel)

      const queryParams = params.toString();
      
      const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`);
      const json = await response.json();

      setJobs(json.data || json); 
    } catch (error) {
      console.error("ERROR AL CARGAR DATOS", error);
    } finally {
      setLoading(false); 
    }
  };

  // Cargar los trabajos apenas abres la página
  useEffect(() => {
    fetchJobsFromAPI(filters); 
  }, []); // cuidado hacemos un loop jaja

  // Cuando se busca:
  const handleSearch = (newFilters) => {
    setFilters(newFilters);       // Guardamos los filtros en el estado
    setCurrentPage(1);           
    
    // Cuando el usuario le da a buscar escribimos los filtros en la barra de direcciones
    const params = new URLSearchParams();
    if (newFilters.textBuscador) params.append('text', newFilters.textBuscador);
    if (newFilters.technology) params.append('technology', newFilters.technology);
    if (newFilters.location) params.append('type', newFilters.location);
    if (newFilters.experienceLevel) params.append('level', newFilters.experienceLevel);

    setSearchParams(params); // Esto actualiza la URL

    // Y luego hacemos la búsqueda con esos filtros
    fetchJobsFromAPI(newFilters);
  };

  // Pagination que si vale
  const totalPages = Math.ceil((jobs?.length || 0) / RESULTS_PER_PAGE);
  const pagedResults = jobs?.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  ) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <main>
      <section>
        <h1>Encuentra tu próximo trabajo</h1>
        <p className="sty">Explora miles de oportunidades en el sector tecnológico.</p>
        
        <SearchFormSection onSearch={handleSearch} filters={filters} />
      </section>

      <section className="resultados">
        <h2>Resultados de búsqueda</h2>
        
        {/* La paciencia es una gran virtud */}
        {loading ? (
          <div>Cargando empleos... ⏳</div>
        ) : (
          <ContainerJobs jobs={pagedResults} />
        )}
      </section>

      {/* Solo mostramos la paginación si no está cargando y si hay resultados */}
      {!loading && jobs.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
      {!loading && jobs.length === 0 && (
          <div className="empty-state" style={{ textAlign: "center", padding: "40px" }}>
            <h3>¡Ups! No encontramos empleos con esos filtros 🕵️‍♂️</h3>
            <p>Intenta buscar con otras palabras, tecnologías o ubicaciones.</p>
          </div>
      )}
    </main>
  );
}