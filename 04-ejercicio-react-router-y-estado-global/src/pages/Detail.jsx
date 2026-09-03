import { useState, useEffect }   from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import snarkdown from "snarkdown";
import styles from "./Detail.module.css";

function JobSection ({ title, content }) {
    const html = snarkdown(content)

    return (
        <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
            {title}
        </h2>

        <div
            className={`${styles.sectionContent} prose`}
            dangerouslySetInnerHTML={{
            __html: html
            }}
        />

        </section>
    )
}

function DetailPageBreadCrumb ({ job }) {
    return (
        <div className={styles.container}>
        <nav className={styles.breadcrumb}>
            <Link 
            to="/search"
            >
            Empleos
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{job.titulo}</span>
        </nav>
        </div>
    )
}


function DetailPageHeader ({ job }) {
    return (
        <>
        <header className={styles.header}>
            <h1 className={styles.title}>
            {job.titulo}
            </h1>
            <p className={styles.meta}>
            {job.empresa} · {job.ubicacion}
            </p>
        </header>
        </>
    )
}


export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate()


    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const [isApplied, setIsApplied] = useState(false);
    
    const handleApplyClick = () => {
        setIsApplied(true);
    };

    const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job';
    const buttonText = isApplied ? "Aplicado!" : "Aplicar";


    useEffect(() => {
        fetch(`https://jscamp-api.vercel.app/api/jobs/${id}`)
        .then(response => response.json())

        .then((data) => {
            setJob(data);
        })
        .catch((err) => {
            setError(err.message);
        })
        .finally(() => {setIsLoading(false)});

    }, [id]);

        if (isLoading) {
        return <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div className={styles.isLoading}>
            <p className={styles.loadingText}>Cargando...</p>
        </div>
        </div>
    }

    if (error || !job) {
        return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <div className={styles.error}>
            <h2 className={styles.errorTitle}>
                Oferta no encontrada
            </h2>
            <button
                onClick={() => navigate('/')}
                className={styles.errorButton}
            >
                Volver al inicio
            </button>

            </div>
        </div>
        )
    }
    else {
        
    return (
        
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <DetailPageBreadCrumb job={job} />
        <DetailPageHeader job={job} />
        
        <JobSection title="Descripción del puesto" content={job.content.description} />
        
        <JobSection title="Responsabilidades" content={job.content.responsibilities} />
        <JobSection title="Requisitios" content={job.content.requirements} />
        <JobSection title="Acerca de la empresa" content={job.content.about} />
        
        <button name="aplicar" className={buttonClasses} onClick={handleApplyClick}>
            {buttonText}
        </button>
        </div>
    )
    }
}