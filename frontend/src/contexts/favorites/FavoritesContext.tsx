import { createContext } from 'react';
import type { Destination } from '../../data/destinations';

export interface Favorite {
    place_id: string;
    places: Destination;
    id?: string;
}

export interface FavoritesContextType {
    favorites: Favorite[];
    addFavorite: (placeId: string) => void;
    removeFavorite: (placeId: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
