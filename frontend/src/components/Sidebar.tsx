import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';

interface SidebarProps {
    setFilters: (filters: FilterState) => void;
}

export interface FilterState {
    scoreRange: [number, number];
    rating: number;
    categories: string[];
}

export default function Sidebar({ setFilters }: SidebarProps) {
    const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
    const [rating, setRating] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const categories = ['Tourism', 'Attraction', 'Sights', 'Nature', 'Historic', 'Cultural'];

    const handleCategoryToggle = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
        applyFilters(scoreRange, rating, newCategories);
    };

    const handleSentimentScoreChange = (value: number[]) => {
        const newRange: [number, number] = [value[0], value[1]];
        setScoreRange(newRange);
        applyFilters(newRange, rating, selectedCategories);
    };

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        applyFilters(scoreRange, newRating, selectedCategories);
    };

    const applyFilters = (
        score: [number, number],
        minRating: number,
        cats: string[]
    ) => {
        setFilters({
            scoreRange: score,
            rating: minRating,
            categories: cats,
        });
    };

    const handleReset = () => {
        setScoreRange([0, 100]);
        setRating(0);
        setSelectedCategories([]);
        setFilters({
            scoreRange: [0, 100],
            rating: 0,
            categories: [],
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
                            className={`w-full justify-start font-normal ${selectedCategories.includes(category)
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
                        value={scoreRange}
                        onValueChange={handleSentimentScoreChange}
                        max={100}
                        step={5}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{scoreRange[0]}</span>
                        <span>{scoreRange[1]}</span>
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
                                fill={i < rating ? 'currentColor' : 'none'}
                            />
                        </button>
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
