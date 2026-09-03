// Lo importamos como RouterLink: "NavLink" ya es otro componente de React Router y el alias confundía, puede llegar a dar errores si luego queremos importarlo.
import { Link as RouterLink } from "react-router";

export function Link ({href, children, ...restOFProps}) {
    
    return (
        <RouterLink to={href} {...restOFProps}>
            {children}
        </RouterLink>
    )
}
