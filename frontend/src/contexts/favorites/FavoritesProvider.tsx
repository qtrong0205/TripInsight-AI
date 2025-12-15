import { ReactNode, useEffect, useState } from 'react';
import { FavoritesContext, FavoritesContextType } from './FavoritesContext';
import { useAuth } from '../useAuth';

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (!user?.access_token) return;

        const getFavorites = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                    },
                });

                const json = await response.json();
                setFavorites(json.data);
            } catch (e) {
                console.error(e);
            }
        };

        getFavorites();
    }, [user]);

    const addFavorite: FavoritesContextType['addFavorite'] = (id: string) => {
        setFavorites((prev) => [...prev, id]);
    };

    const removeFavorite: FavoritesContextType['removeFavorite'] = (id: string) => {
        setFavorites((prev) => prev.filter((fav) => fav !== id));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}
