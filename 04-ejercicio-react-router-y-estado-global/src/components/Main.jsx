import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { ContainerJobs } from "./JobCard.jsx";
import { Pagination } from "./Pagination.jsx";
import { SearchFormSection } from "./SearchFormSection.jsx";


const RESULTS_PER_PAGE = 5;

// Esta función lee la URL de arriba antes de que la página cargue


export function Main() {
  // Memoria central
  const [jobs, setJobs] = useState([]); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  
  // const [filters, setFilters] = useState({
  //   textBuscador: searchParams.get('text') || '',
  //   technology: searchParams.get('technology') || '',
  //   location: searchParams.get('type') || '',
  //   experienceLevel: searchParams.get('level') || ''
  // });

  // En este caso los filtros solo viven en la URL, de esta forma no hay estado duplicados
  const filters = {
    textBuscador: searchParams.get('text') || '',
    technology: searchParams.get('technology') || '',
    location: searchParams.get('type') || '',
    experienceLevel: searchParams.get('level') || ''
  };

  // Función para usar api con filtros
  // Antes recibias los filtros y volvías a armar los params aquí (misma lógica que en handleSearch)
  // Ahora recibimos los searchParams listos: como la API usa los mismos nombres (text, technology, type, level) no hay que cambiar nada: simplificamos el código
  const fetchJobsFromAPI = async (params) => {
    setLoading(true); 
    try {
      const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${params}`);
      const json = await response.json();

      setJobs(json.data || json); 
    } catch (error) {
      console.error("ERROR AL CARGAR DATOS", error);
    } finally {
      setLoading(false); 
    }
  };

  // Cargar los trabajos apenas abres la página
  // Ahora cada vez que la URL cambia volvemos a hacer la búsqueda
  useEffect(() => {
    fetchJobsFromAPI(searchParams); 
  }, [searchParams]);

  // Cuando se busca:
  // Con este nuevo enfoque, solo escribimos los filtros en la URL y el useEffect de arriba hace la búsqueda
  const handleSearch = (newFilters) => {
    setCurrentPage(1);           
    
    // Cuando el usuario le da a buscar escribimos los filtros en la barra de direcciones
    const params = new URLSearchParams();
    if (newFilters.textBuscador) params.set('text', newFilters.textBuscador);
    if (newFilters.technology) params.set('technology', newFilters.technology);
    if (newFilters.location) params.set('type', newFilters.location);
    if (newFilters.experienceLevel) params.set('level', newFilters.experienceLevel);

    // Esto actualiza la URL y dispara el useEffect que busca en la API
    setSearchParams(params);
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