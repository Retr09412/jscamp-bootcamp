import { useState, useEffect } from "react";

export function useRouter(){
    const [currentPage, setCurrentPage] = useState(window.location.pathname);

    useEffect(() => {
    const handleLocationChange = () => {
    setCurrentPage(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
        window.removeEventListener('popstate', handleLocationChange)
    }

}, [])
function navigateTo(path){
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'))
}
    return {currentPage, navigateTo}
}   