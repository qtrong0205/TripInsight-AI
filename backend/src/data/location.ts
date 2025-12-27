export interface Review {
    id: string;
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    // AI sentiment score on a 0-100 scale for this review
    sentimentScore: number;
}

export interface Destination {
    id: string;
    slug: string;
    name: string;
    location: string;
    image: string;
    price: number;
    rating: number;
    reviews: number;
    categories: string[];
    description: string;
    duration: string;
    reviewsList: Review[];
    // AI sentiment score on a 0-100 scale
    sentimentScore: number;
}

export interface InsertedDestination {
    name: string;
    slug: string;
    location: string;
    image: string[];
    categories: string[];
    description: string;
    lat: number;
    lon: number;
    static_map_url: string;
    is_featured?: boolean;
    active?: boolean;
    rating?: number;
    avg_sentiment_score?: number;
    reviews?: number;
    created_at?: string;
}

export interface DestinationFilters {
    categories?: string;
    rating?: number;
    sentimentScore?: number;
    sort?: "newest" | "popular" | "rating";
    active?: boolean;
}

