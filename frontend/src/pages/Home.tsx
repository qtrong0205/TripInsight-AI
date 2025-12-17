import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Globe, Flag, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryChip from '../components/CategoryChip';
import DestinationCard from '../components/DestinationCard';
import Sidebar, { FilterState } from '../components/Sidebar';
import { Destination } from '../data/destinations';
import { useLocationsInfinite } from '../hooks/location.queries';

const countries = [
    { label: 'All', icon: <Globe className="w-4 h-4" strokeWidth={2} />, keywords: [] },
    { label: 'Viet Nam', icon: <Flag className="w-4 h-4" strokeWidth={2} />, keywords: ['vietnam', 'việt nam', 'viet nam'] },
    { label: 'Japan', icon: <Flag className="w-4 h-4" strokeWidth={2} />, keywords: ['japan', 'Nhật Bản'] },
    { label: 'USA', icon: <Flag className="w-4 h-4" strokeWidth={2} />, keywords: ['United States of America', 'America'] },
    { label: 'England', icon: <Flag className="w-4 h-4" strokeWidth={2} />, keywords: ['United Kingdom'] },
    { label: 'Singapore', icon: <Flag className="w-4 h-4" strokeWidth={2} />, keywords: ['singapore'] },
];

export default function Home() {
    const [searchParams] = useSearchParams();
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [filters, setFilters] = useState<FilterState>({
        scoreRange: [0, 1000],
        rating: 0,
        categories: [],
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const apiFilters = useMemo(() => {
        return {
            categories: filters.categories,       // string[]
            rating: filters.rating || undefined,  // number | undefined
            sentimentScore:
                filters.scoreRange[0] > 0
                    ? filters.scoreRange[0]
                    : undefined,
            // sort: 'popular' | 'rating' | 'newest'
        };
    }, [filters]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useLocationsInfinite(apiFilters);

    // Flatten pages from infinite query; ensure array type
    const destinations: Destination[] = useMemo(() => {
        const pages = (data?.pages ?? []) as Destination[][] | Destination[];
        // If backend returns arrays per page: flatten; if single array: coerce
        const flat = Array.isArray(pages[0]) ? (pages as Destination[][]).flat() : (pages as Destination[]);
        // Apply client-side filters (optional): search/country/basic filters
        return flat.filter((dest) => {
            if (selectedCountry === 'All') return true;

            const country = countries.find(c => c.label === selectedCountry);
            if (!country || country.keywords.length === 0) return true;

            const locationLower = (dest.location || '').toLowerCase();
            const matchesCountry = country.keywords.some(keyword => locationLower.includes(keyword));
            return matchesCountry;
        });
    }, [data?.pages, selectedCountry]);

    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const el = bottomRef.current;
        if (!el) return;
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
                <Sidebar filters={filters} setFilters={setFilters} />
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

                {/* Mobile filter toggle button */}
                <div className="md:hidden fixed bottom-6 right-6 z-40">
                    <Button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="rounded-full w-14 h-14 shadow-lg bg-primary text-primary-foreground hover:bg-secondary"
                    >
                        {sidebarOpen ? (
                            <X className="w-6 h-6" strokeWidth={2} />
                        ) : (
                            <SlidersHorizontal className="w-6 h-6" strokeWidth={2} />
                        )}
                    </Button>
                </div>

                {/* Mobile filter sidebar */}
                {sidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)}>
                        <div
                            className="absolute left-0 top-0 bottom-0 w-72 bg-background overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h2 className="font-semibold text-lg">Filters</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="w-5 h-5" strokeWidth={2} />
                                </Button>
                            </div>
                            <Sidebar filters={filters} setFilters={setFilters} />
                        </div>
                    </div>
                )}

                {/* Countries */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-   3 pb-4">
                            {countries.map((country) => (
                                <CategoryChip
                                    key={country.label}
                                    label={country.label}
                                    icon={country.icon}
                                    active={selectedCountry === country.label}
                                    onClick={() => setSelectedCountry(country.label)}
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
                    {status === 'pending' && (
                        <div className="text-center py-12 text-muted-foreground">Loading destinations…</div>
                    )}
                    {status === 'error' && (
                        <div className="text-center py-12 text-destructive">{(error as Error)?.message || 'Failed to load destinations'}</div>
                    )}
                    {status === 'success' && destinations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {destinations.map((destination, index) => (
                                <DestinationCard key={destination.place_id ?? destination.id ?? index} destination={destination} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                No destinations found matching your criteria
                            </p>
                        </div>
                    )}
                    {isFetchingNextPage && (
                        <div className="text-center py-6 text-muted-foreground">Loading more…</div>
                    )}
                    <div ref={bottomRef} className="h-8" />
                </section>
            </div>
        </div>

    );
}
