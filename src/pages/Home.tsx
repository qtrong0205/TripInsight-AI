import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Compass, Mountain, Building2, Palmtree, Landmark, TreePine } from 'lucide-react';
import CategoryChip from '../components/CategoryChip';
import DestinationCard from '../components/DestinationCard';
import Sidebar, { FilterState } from '../components/Sidebar';
import { Destination } from '../data/destinations';

const categories = [
    { label: 'All', icon: <Compass className="w-4 h-4" strokeWidth={2} /> },
    { label: 'Beach', icon: <Palmtree className="w-4 h-4" strokeWidth={2} /> },
    { label: 'Mountain', icon: <Mountain className="w-4 h-4" strokeWidth={2} /> },
    { label: 'City', icon: <Building2 className="w-4 h-4" strokeWidth={2} /> },
    { label: 'Cultural', icon: <Landmark className="w-4 h-4" strokeWidth={2} /> },
    { label: 'Nature', icon: <TreePine className="w-4 h-4" strokeWidth={2} /> },
];

export default function Home() {
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 5000],
        rating: 0,
        categories: [],
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const getLocations = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('http://localhost:3000/api/locations');
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
                const data = await res.json();
                setDestinations(data.data as Destination[]);
            } catch (e: any) {
                setError(e?.message || 'Failed to load destinations');
            } finally {
                setLoading(false);
            }
        };
        getLocations();
    }, []);

    // const destinations = destinations.filter((dest) => {
    //     // Search filter
    //     if (searchQuery && !dest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    //         !dest.location.toLowerCase().includes(searchQuery.toLowerCase())) {
    //         return false;
    //     }

    //     // Category filter
    //     if (selectedCategory !== 'All' && !dest.categories.includes(selectedCategory)) {
    //         return false;
    //     }

    //     // Sidebar filters
    //     if (filters.categories.length > 0) {
    //         const hasCategory = filters.categories.some((cat) => dest.categories.includes(cat));
    //         if (!hasCategory) return false;
    //     }

    //     if (dest.price < filters.priceRange[0] || dest.price > filters.priceRange[1]) {
    //         return false;
    //     }

    //     if (dest.rating < filters.rating) {
    //         return false;
    //     }

    //     return true;
    // });

    return (
        <div className="flex flex-col md:flex-row max-w-screen-2xl min-h-screen bg-background">
            {/* Sidebar */}
            <div className="hidden md:block md:w-64 border-r">
                <Sidebar setFilters={setFilters} />
            </div>

            {/* Main */}
            <div className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] overflow-hidden bg-gradient-1">
                    <img
                        src="https://c.animaapp.com/mir59zn4CW2nTa/img/ai_1.png"
                        alt="Tropical travel background"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />

                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4">
                            Discover Your Next Adventure
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-foreground max-w-2xl">
                            Explore breathtaking destinations around the world and create unforgettable memories
                        </p>
                    </div>
                </section>

                {/* Categories */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-3 pb-4">
                            {categories.map((category) => (
                                <CategoryChip
                                    key={category.label}
                                    label={category.label}
                                    icon={category.icon}
                                    active={selectedCategory === category.label}
                                    onClick={() => setSelectedCategory(category.label)}
                                />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </section>

                {/* Destinations */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Destinations'}
                        </h2>
                        <p className="text-muted-foreground">
                            {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {loading && (
                        <div className="text-center py-12 text-muted-foreground">Loading destinations…</div>
                    )}
                    {error && (
                        <div className="text-center py-12 text-destructive">{error}</div>
                    )}
                    {!loading && !error && destinations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {destinations.map((destination) => (
                                <DestinationCard key={destination.id} destination={destination} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                No destinations found matching your criteria
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>

    );
}
