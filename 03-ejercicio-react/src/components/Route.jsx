
import { useRouter} from "../hooks/useRouter.jsx";
import { NotFoundPage } from "../pages/404.jsx";

// const validPaths = ["/", "/search"];

// Hola crack! Lo que hiciste está genial, te quiero mostrar una alternativa para no depender de una constante `validPaths`.
// Hacelo como te voy a mostrar está bueno porque, si mañana agregamos 10 páginas más, no tenemos que depender de agregarlas también en `validPaths`.
// Esto lo hace más dinámico y escalable.
// Lo que hacemos es crear un Set llamado `usedPaths` que va a almacenar todos los paths que se van a usar.
// Esta variable no se elimina nunca a menos que reinicies la aplicación, por lo que se va a mantener viva y con todos los paths durante toda la sesión en la que el usuario navegue por la aplicación.
// Si esto lo creamos dentro del componente si se reinicia cada vez que se renderiza el componente.
const usedPaths = new Set();

export function Route ({path, component: Component, error}) {
    const {currentPage} = useRouter();

    // 1. Si tenemos un path, lo agregamos como uno disponible
    if(path) usedPaths.add(path);

    // 2. Si estamos en una ruta no válida y error es true, mostramos la página 404
    if (error && !usedPaths.has(currentPage)) {
        return <NotFoundPage />;
    }

    // 3. Si tenemos un path que coincide con la ruta actual, mostramos el componente
    if(path && currentPage === path) {
        return <Component />;
    }

    // 4. Si no tenemos un path, no mostramos nada
    if (!path) {
        return null;
    }

   /*  if (path) {
        if (currentPage === path) {return <Component />;}
        
        return null; // Si no coincide, no muestra nada.
    }

    if (error) {
        if (!validPaths.includes(currentPage)) {return <NotFoundPage />; // O <NotFoundPage /> si prefieres
}
    }

    return null; */
}