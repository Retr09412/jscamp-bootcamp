import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
    persist(
    // Antes se guardaban objetos completos del empleo en vez de IDs y faltaba el helper isFavorite, lo ideal es guardar solo los IDs:
    (set, get) => ({
    favorites: [],
    addFavorite: (jobId) => set((state) => ({ favorites: [...state.favorites, jobId] })),
    removeFavorite: (jobId) => set((state) => ({ favorites: state.favorites.filter(id => id !== jobId) })),
    // Si el id ya está guardado lo quitamos, sino lo agregamos:
    toggleFavorite: (jobId) =>
        set((state) => ({
            favorites: state.favorites.includes(jobId)
                ? state.favorites.filter(id => id !== jobId)
                : [...state.favorites, jobId],
        })),
    isFavorite: (jobId) => get().favorites.includes(jobId),
    })

), {
    name: 'mi-caja-fuerte-favorites',
}   
)