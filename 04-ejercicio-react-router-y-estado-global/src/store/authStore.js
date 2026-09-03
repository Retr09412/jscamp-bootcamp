import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
        
        isLoggedIn: false,
        login: () => set({ isLoggedIn: true }),
        logout: () => set({ isLoggedIn: false }),
    
        }),
        {
            name: 'mi-caja-fuerte-auth',
        }
    )
);      