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

    const getSentimentColor = (score: number) => {
        if (score >= 75) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    };
    return (
        <Card
            className="overflow-hidden sm:hover:shadow-lg transition-shadow duration-200 bg-card border-border group">
            <Link
                to={`/destination/${destination.slug}${destination.place_id ? `?place_id=${encodeURIComponent(String(destination.place_id))}` : ''}`}
            >
                <div className="relative">
                    <img
                        src={destination.image && 'https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png'}
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
                        <div className="flex justify-start items-center gap-3 my-1">
                            <span className="text-gray-600 dark:text-gray-400">AI Sentiment Score</span>
                            <div className={`px-2 py-1 rounded-full ${getSentimentColor(destination.avg_sentiment_score)}`}>
                                <span className="text-lg">{destination.avg_sentiment_score}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs sm:text-sm">
                            <Star className="w-4 h-4 text-tertiary" strokeWidth={2} fill="currentColor" />
                            <span className="font-medium text-card-foreground">{destination.rating}</span>
                            <span className="text-muted-foreground">({destination.reviews})</span>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
