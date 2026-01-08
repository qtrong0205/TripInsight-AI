export interface ReviewUser {
    id: string;
    username: string;
    avatar: string | null;
}

export interface Review {
    review_id: string;
    place_id: string;
    users_id: string;
    content: string;
    stars: number;
    score: number;
    created_at: string;
    updated_at: string;
    users: ReviewUser;
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
    lat: number;
    lon: number;
    categories: string[];
    description: string;
    duration: string;
    reviewsList: Review[];
    static_map_url: string
}

export interface DestinationFilters {
    categories?: string[];
    rating?: number;
    sentimentScore?: number;
    sort?: "newest" | "popular" | "rating";
}

export interface DataToInsert {
    name: string;
    location: string;
    description: string;
    images: string[];
    categories: string[];
    isFeatured?: boolean;
    active?: boolean;
}