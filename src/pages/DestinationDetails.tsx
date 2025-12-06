import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Clock, DollarSign, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ReviewCard from '../components/ReviewCard';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/destinations';
import { useFavorites } from '../contexts/FavoritesContext';

export default function DestinationDetails() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const [newReview, setNewReview] = useState('');

    const destination = destinations.find((d) => d.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!destination) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-3xl font-bold text-foreground mb-4">Destination Not Found</h1>
                <Button
                    onClick={() => navigate('/')}
                    className="bg-primary text-primary-foreground hover:bg-secondary"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                    Back to Home
                </Button>
            </div>
        );
    }

    const isFavorite = favorites.includes(destination.id);
    const similarDestinations = destinations
        .filter((d) => d.id !== destination.id && d.categories.some((cat) => destination.categories.includes(cat)))
        .slice(0, 4);

    const handleFavoriteClick = () => {
        if (isFavorite) {
            removeFavorite(destination.id);
        } else {
            addFavorite(destination.id);
        }
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit to an API
        setNewReview('');
        alert('Thank you for your review!');
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Back Button */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    className="text-foreground hover:bg-neutral hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                    Back
                </Button>
            </div>

            {/* Hero Image Gallery */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                            loading="eager"
                        />
                    </div>
                    <div className="hidden lg:grid grid-rows-2 gap-4">
                        <img
                            src={destination.image}
                            alt={`${destination.name} view 2`}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                        />
                        <img
                            src={destination.image}
                            alt={`${destination.name} view 3`}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title and Actions */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-foreground mb-2">{destination.name}</h1>
                                    <div className="flex items-center text-muted-foreground mb-4">
                                        <MapPin className="w-5 h-5 mr-2" strokeWidth={2} />
                                        <span className="text-lg">{destination.location}</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleFavoriteClick}
                                    size="lg"
                                    className={`rounded-full ${isFavorite
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

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {destination.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="px-4 py-2 bg-neutral text-foreground rounded-full text-sm font-medium"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <Card className="bg-card border-border">
                                    <CardContent className="p-4 text-center">
                                        <Star className="w-6 h-6 text-tertiary mx-auto mb-2" strokeWidth={2} fill="currentColor" />
                                        <div className="font-bold text-lg text-card-foreground">{destination.rating}</div>
                                        <div className="text-sm text-muted-foreground">Rating</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardContent className="p-4 text-center">
                                        <Users className="w-6 h-6 text-primary mx-auto mb-2" strokeWidth={2} />
                                        <div className="font-bold text-lg text-card-foreground">{destination.reviews}</div>
                                        <div className="text-sm text-muted-foreground">Reviews</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardContent className="p-4 text-center">
                                        <Clock className="w-6 h-6 text-primary mx-auto mb-2" strokeWidth={2} />
                                        <div className="font-bold text-lg text-card-foreground">{destination.duration}</div>
                                        <div className="text-sm text-muted-foreground">Duration</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardContent className="p-4 text-center">
                                        <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" strokeWidth={2} />
                                        <div className="font-bold text-lg text-card-foreground">${destination.price}</div>
                                        <div className="text-sm text-muted-foreground">Per Person</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">About This Destination</h2>
                            <p className="text-foreground leading-relaxed">{destination.description}</p>
                        </div>

                        <Separator className="bg-border" />

                        {/* Reviews Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6">Reviews</h2>
                            <div className="space-y-4 mb-8">
                                {destination.reviewsList.map((review) => (
                                    <ReviewCard key={review.id} review={review} />
                                ))}
                            </div>

                            {/* Write Review */}
                            <Card className="bg-card border-border">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg text-card-foreground mb-4">Write a Review</h3>
                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <Textarea
                                            placeholder="Share your experience..."
                                            value={newReview}
                                            onChange={(e) => setNewReview(e.target.value)}
                                            className="min-h-32 bg-background text-foreground border-border"
                                        />
                                        <Button
                                            type="submit"
                                            className="bg-primary text-primary-foreground hover:bg-secondary"
                                        >
                                            Submit Review
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Map Card */}
                        <Card className="bg-card border-border overflow-hidden">
                            <CardContent className="p-0">
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(destination.location)}`}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Map of ${destination.name}`}
                                />
                            </CardContent>
                        </Card>

                        {/* Booking Card */}
                        <Card className="bg-card border-border">
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-card-foreground mb-1">${destination.price}</div>
                                    <div className="text-sm text-muted-foreground">per person</div>
                                </div>
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary">
                                    Book Now
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full bg-background text-foreground border-border hover:bg-neutral hover:text-foreground"
                                >
                                    Contact Us
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Similar Destinations */}
            {similarDestinations.length > 0 && (
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-neutral">
                    <h2 className="text-3xl font-bold text-foreground mb-8">Similar Destinations</h2>
                    <ScrollArea className="w-full">
                        <div className="flex space-x-6 pb-4">
                            {similarDestinations.map((dest) => (
                                <div key={dest.id} className="w-80 flex-shrink-0">
                                    <DestinationCard destination={dest} />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </section>
            )}
        </div>
    );
}
