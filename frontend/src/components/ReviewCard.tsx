import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Review } from '../data/destinations';

interface ReviewCardProps {
    review: Review;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getSentimentColor = (score: number) => {
    if (score >= 75) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
};

export default function ReviewCard({ review }: ReviewCardProps) {
    const username = review.users?.username || 'Anonymous';
    const avatar = review.users?.avatar;

    return (
        <Card className="bg-card border-border">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                        {avatar && <AvatarImage src={avatar} alt={username} />}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-card-foreground">{username}</h4>
                                <p className="text-sm text-muted-foreground">{formatDate(review.created_at)}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 text-tertiary"
                                        strokeWidth={2}
                                        fill={i < review.stars ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-card-foreground leading-relaxed">{review.content}</p>
                        {review.score && (
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 ${getSentimentColor(review.score)} rounded-full`}>
                                    AI Score: {review.score}/100
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
