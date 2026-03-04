import { useRouter } from "../hooks/useRouter.jsx";

export function Link ({href, children, ...restOFProps}) {
    
    const {navigateTo} = useRouter();

    const handleClick = (event) => {
        event.preventDefault()

        navigateTo(href)
    }
    
    return (
        <a href={href} {...restOFProps} onClick={handleClick}>
            {children}
        </a>
    )
}
