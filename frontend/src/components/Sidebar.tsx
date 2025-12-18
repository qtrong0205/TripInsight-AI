import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, TrendingUp, StarIcon } from 'lucide-react';

export type SortOption = 'newest' | 'popular' | 'rating';

export interface FilterState {
    scoreRange: [number, number];
    rating: number;
    categories: string[];
    sort: SortOption;
}

interface SidebarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

export default function Sidebar({ filters, setFilters }: SidebarProps) {
    const categories = ['Tourism', 'Attraction', 'Building', 'Natural', 'Heritage', 'Beach'];

    const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
        { value: 'newest', label: 'Newest', icon: <Clock className="w-4 h-4" strokeWidth={2} /> },
        { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" strokeWidth={2} /> },
        { value: 'rating', label: 'Highest Rated', icon: <StarIcon className="w-4 h-4" strokeWidth={2} /> },
    ];

    const handleCategoryToggle = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category];
        setFilters({ ...filters, categories: newCategories });
    };

    const handleSentimentScoreChange = (value: number[]) => {
        const newRange: [number, number] = [value[0], value[1]];
        setFilters({ ...filters, scoreRange: newRange });
    };

    const handleRatingChange = (newRating: number) => {
        setFilters({ ...filters, rating: newRating });
    };

    const handleSortChange = (sort: SortOption) => {
        setFilters({ ...filters, sort });
    };

    const handleReset = () => {
        setFilters({
            scoreRange: [0, 100],
            rating: 0,
            categories: [],
            sort: 'newest',
        });
    };

    return (
        <aside className="w-full lg:w-64 bg-card border-r border-border p-6 space-y-8">
            <div>
                <h3 className="font-semibold text-lg mb-4 text-card-foreground">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => handleCategoryToggle(category)}
                            variant="ghost"
                            className={`w-full justify-start font-normal ${filters.categories.includes(category)
                                ? 'bg-neutral text-primary'
                                : 'text-card-foreground hover:bg-neutral hover:text-card-foreground'
                                }`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            <Separator className="bg-border" />

            <div>
                <h3 className="font-semibold text-lg mb-4 text-card-foreground">Sentiment Score Range</h3>
                <div className="space-y-4">
                    <Slider
                        value={filters.scoreRange}
                        onValueChange={handleSentimentScoreChange}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{filters.scoreRange[0]}</span>
                        <span>{filters.scoreRange[1]}</span>
                    </div>
                </div>
            </div>

            <Separator className="bg-border" />

            <div>
                <h3 className="font-semibold text-lg mb-4 text-card-foreground">Minimum Rating</h3>
                <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleRatingChange(i + 1)}
                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        >
                            <Star
                                className="w-6 h-6 text-tertiary cursor-pointer transition-transform hover:scale-110"
                                strokeWidth={2}
                                fill={i < filters.rating ? 'currentColor' : 'none'}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <Separator className="bg-border" />

            <div>
                <h3 className="font-semibold text-lg mb-4 text-card-foreground">Sort By</h3>
                <div className="space-y-2">
                    {sortOptions.map((option) => (
                        <Button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            variant="ghost"
                            className={`w-full justify-start font-normal gap-2 ${filters.sort === option.value
                                ? 'bg-neutral text-primary'
                                : 'text-card-foreground hover:bg-neutral hover:text-card-foreground'
                                }`}
                        >
                            {option.icon}
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-3">
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full bg-background text-foreground border-border hover:bg-neutral hover:text-foreground"
                >
                    Reset Filters
                </Button>
            </div>
        </aside>
    );
}
