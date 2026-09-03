import { Link as NavLink } from "react-router";

export function Link ({href, children, ...restOFProps}) {
    
    return (
        <NavLink to={href} {...restOFProps}>
            {children}
        </NavLink>
    )
}
