
import { useRouter} from "../hooks/useRouter.jsx";
import { NotFoundPage } from "../pages/404.jsx";

const validPaths = ["/", "/search"];


export function Route ({path, component: Component, error}) {
    const {currentPage} = useRouter();
    if (path) {
        if (currentPage === path) {return <Component />;}
        
        return null; // Si no coincide, no muestra nada.
    }

    if (error) {
        if (!validPaths.includes(currentPage)) {return <NotFoundPage />; // O <NotFoundPage /> si prefieres
}
    }

    return null;
}