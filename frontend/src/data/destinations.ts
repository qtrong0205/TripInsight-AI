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