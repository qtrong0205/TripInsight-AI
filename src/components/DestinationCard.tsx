import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Destination } from '../data/destinations';

interface DestinationCardProps {
    destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const isFavorite = favorites.includes(destination.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isFavorite) {
            removeFavorite(destination.id);
        } else {
            addFavorite(destination.id);
        }
    };

    return (
        <Card className="overflow-hidden sm:hover:shadow-lg transition-shadow duration-200 bg-card border-border group">
            <Link to={`/destination/${destination.slug}`}>
                <div className="relative">
                    <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-40 sm:h-48 md:h-56 object-cover object-center"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <Button
                        onClick={handleFavoriteClick}
                        size="sm"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={isFavorite}
                        className={`absolute top-3 right-3 rounded-full w-9 h-9 sm:w-10 sm:h-10 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isFavorite
                            ? 'bg-tertiary text-tertiary-foreground hover:bg-tertiary hover:opacity-90'
                            : 'bg-background text-foreground hover:bg-neutral border border-border'
                            }`}
                    >
                        <Heart
                            className="w-5 h-5"
                            strokeWidth={2}
                            fill={isFavorite ? 'currentColor' : 'none'}
                        />
                    </Button>
                </div>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {destination.name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-xs sm:text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-1 shrink-0" strokeWidth={2} />
                            {destination.location}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs sm:text-sm">
                            <Star className="w-4 h-4 text-tertiary" strokeWidth={2} fill="currentColor" />
                            <span className="font-medium text-card-foreground">{destination.rating}</span>
                            <span className="text-muted-foreground">({destination.reviews})</span>
                        </div>
                        <div className="text-right">
                            <div className="text-base sm:text-lg font-bold text-card-foreground">${destination.price}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground">per person</div>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
