import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
    persist(
    (set) => ({
    favorites: [],
    addFavorite: (job) => set((state) => ({ favorites: [...state.favorites, job] })),
    removeFavorite: (jobId) => set((state) => ({ favorites: state.favorites.filter(job => job.id !== jobId) })),
    toggleFavorite: (job) => set((state) => {
        const isFavorite = state.favorites.some(fav => fav.id === job.id);
        return {
            favorites: isFavorite
                ? state.favorites.filter(fav => fav.id !== job.id)
                : [...state.favorites, job]
        }})
    
    })

), {
    name: 'mi-caja-fuerte-favorites',
}   
)