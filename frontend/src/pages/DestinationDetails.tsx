import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { MapPin, Star, Heart, Clock, Brain, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ReviewCard from '../components/ReviewCard';
import DestinationCard from '../components/DestinationCard';
import type { Destination } from '../data/destinations';
import { useFavorites } from '../contexts/favorites/useFavorites';
import { useLocationQuery, useReview, useCreateReview } from '../hooks/location.queries';
import ReviewForm, { ReviewFormData } from '../components/ReviewForm';
import { useAuth } from '../contexts/useAuth';

export default function DestinationDetails() {
    const [rating, setRating] = useState(0);
    const location = useLocation();
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const [newReview, setNewReview] = useState('');
    const { user } = useAuth();

    const params = new URLSearchParams(location.search);
    const placeId = params.get('place_id');
    const { data: locationData, isLoading, error } = useLocationQuery(placeId);
    const { data: reviewData, isLoading: reviewLoading, error: reviewError } = useReview(placeId);
    const { mutate: createReview, isPending: isSubmittingReview } = useCreateReview();

    const destination = (locationData?.location?.data as Destination | undefined);
    const similar: Destination[] = Array.isArray(locationData?.similar?.data)
        ? (locationData!.similar.data as Destination[])
        : [];
    const reviewsList = reviewData?.data

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-muted-foreground">
                Loading destination…
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-destructive">
                {(error as Error)?.message || String(error)}
            </div>
        );
    }

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

    const handleFavoriteClick = () => {
        if (isFavorite) {
            removeFavorite(destination.id);
        } else {
            addFavorite(destination.id);
        }
    };

    const handleReviewSubmit = (data: ReviewFormData) => {
        if (!user?.access_token || !placeId) {
            navigate('/login');
            return;
        }

        createReview({
            data: {
                content: data.content,
                star: data.stars,
            },
            token: user.access_token,
            placeId: placeId,
        });
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
                            src={destination.image[0]}
                            alt={destination.name}
                            className="w-full max-w-full h-64 sm:h-80 lg:h-[420px] xl:h-[480px] object-cover rounded-lg mx-auto"
                            loading="eager"
                        />
                    </div>
                    <div className="hidden lg:grid grid-rows-2 gap-4">
                        <img
                            src={destination.image[1]}
                            alt={`${destination.name} view 2`}
                            className="w-full max-w-full h-[200px] xl:h-[230px] object-cover rounded-lg"
                            loading="lazy"
                        />
                        <img
                            src={destination.image[2]}
                            alt={`${destination.name} view 3`}
                            className="w-full max-w-full h-[200px] xl:h-[230px] object-cover rounded-lg"
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
                                        <div className="font-bold text-lg text-card-foreground">{parseFloat(destination.rating).toFixed(1)}</div>
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
                                        <Brain className="w-6 h-6 text-primary mx-auto mb-2" strokeWidth={2} />
                                        <div className="font-bold text-lg text-card-foreground">{Math.round(destination.avg_sentiment_score)}</div>
                                        <div className="text-sm text-muted-foreground">AI Sentiment Score</div>
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
                                {reviewsList.map((review) => (
                                    <ReviewCard key={review.review_id} review={review} />
                                ))}
                            </div>

                            {/* Write Review */}
                            <ReviewForm onSubmit={handleReviewSubmit} isLoading={isSubmittingReview} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Map Card */}
                        <Card className="bg-card border-border overflow-hidden">
                            <CardContent className="p-0">
                                <img
                                    src={destination.static_map_url}
                                    width="100%"
                                    height="300"
                                    alt={`Map of ${destination.name}`}
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section >

            {/* Similar Destinations */}
            {
                similar.length > 0 && (
                    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-neutral">
                        <h2 className="text-3xl font-bold text-foreground mb-8">Similar Destinations</h2>
                        <ScrollArea className="w-full">
                            <div className="flex space-x-6 pb-4">
                                {similar.map((dest: Destination) => (
                                    <div key={dest.id} className="w-80 flex-shrink-0">
                                        <DestinationCard destination={dest} />
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </section>
                )
            }
        </div >
    );
}
