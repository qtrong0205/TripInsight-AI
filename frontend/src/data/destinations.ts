export interface Review {
    id: string;
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
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
    embed_map_url: string
}

export interface DestinationFilters {
    categories?: string[];
    rating?: number;
    sentimentScore?: number;
    sort?: "newest" | "popular" | "rating";
}
