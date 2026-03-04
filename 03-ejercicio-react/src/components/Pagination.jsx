import styles from './Pagination.module.css';

export function Pagination({currentPage = 1, totalPages = 5, onPageChange}) {
  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  
  const stylePrevButton = isFirstPage ? {pointerEvents: 'none', opacity: 0.5} : {};
  const styleNextButton = isLastPage ? {pointerEvents: 'none', opacity: 0.5} : {};

  const handlePageClick = (event) => {
    event.preventDefault()
    if(isFirstPage ===false){
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPageClick = (event) => {
    event.preventDefault()
    if(isLastPage === false){
      onPageChange(currentPage + 1)
    }
  }

  const handlePageChange = (event, page) => {
    event.preventDefault()
    if (page !== currentPage){
      onPageChange(page)
    }
  }
  return (
    <nav className={styles.pagination}>
      {
        isFirstPage === false && (
          <a href="#prev" aria-label="Ir a la página de resultados de búsqueda anterior" title="Anterior" style={stylePrevButton} onClick={(handlePageClick)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 6l-6 6l6 6" />
            </svg>
          </a>
        )
      }




      {pages.map(page => (
        <a 
          key={page}
          href={`page${page}`}
          className = {currentPage === page ? styles.isActive : ''}
          onClick = {(event) => handlePageChange(event, page)} 
      >
          {page}
        </a>
      ))}



      { 
        isLastPage === false && ( 
          <a href="#next" aria-label="Ir a la página de resultados de búsqueda siguiente" title="Siguiente" style={styleNextButton} onClick={handleNextPageClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
            </svg>
          </a>
        )
      }
    </nav>
  )
}