import { ReactNode, useEffect, useState } from 'react';
import { FavoritesContext, FavoritesContextType, Favorite } from './FavoritesContext';
import { useAuth } from '../useAuth';

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    const fetchFavorites = async () => {
        if (!user?.access_token) return;
        try {
            const response = await fetch('http://localhost:3000/api/favorites', {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
            });

            const json = await response.json();
            // Expect backend to return array of Favorite objects
            setFavorites(Array.isArray(json.data) ? json.data : []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    const addFavorite: FavoritesContextType['addFavorite'] = (placeId: string) => {
        const addFavorite = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/favorites', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.access_token}`,
                    },
                    body: JSON.stringify({ placeId }),
                });

                const json = await response.json();
                // If backend returns full object, append; else refresh list to include enriched data
                if (json?.data && json.data.places) {
                    setFavorites((prev) => [...prev, json.data as Favorite]);
                } else {
                    await fetchFavorites();
                }
            } catch (error) {
                console.error(error);
            }
        }
        addFavorite()
    };

    const removeFavorite: FavoritesContextType['removeFavorite'] = (placeId: string) => {
        setFavorites((prev) => prev.filter((fav) => fav.place_id !== placeId));
        const addFavorite = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/favorites/${placeId}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.access_token}`,
                    },
                });

                const json = await response.json();
                if (json?.data && json.data.places) {
                    setFavorites((prev) => [...prev, json.data as Favorite]);
                } else {
                    await fetchFavorites();
                }
            } catch (error) {
                console.error(error);
            }
        }
        addFavorite()
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}
