import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DestinationCard from '../components/DestinationCard';
import { useFavorites } from '../contexts/favorites/useFavorites';
import { destinations } from '../data/destinations';

export default function Favorites() {
    const { favorites } = useFavorites();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [favorites]);


    return (
        <div className="min-h-screen bg-background">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">My Favorites</h1>
                    <p className="text-muted-foreground">
                        {favorites.length} saved destination{favorites.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites
                            .filter(fav => fav && fav.places && fav.place_id != null)
                            .map((fav) => (
                                <DestinationCard key={String(fav.place_id)} destination={fav.places} />
                            ))}
                    </div>
                ) : (
                    <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
                            <h2 className="text-2xl font-bold text-card-foreground mb-2">No Favorites Yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Start exploring and save your favorite destinations
                            </p>
                            <Link to="/">
                                <Button className="bg-primary text-primary-foreground hover:bg-secondary">
                                    Explore Destinations
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
}
