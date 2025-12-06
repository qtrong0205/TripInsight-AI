import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Review } from '../data/destinations';

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={review.avatar} alt={review.userName} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {review.userName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-card-foreground">{review.userName}</h4>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 text-tertiary"
                                        strokeWidth={2}
                                        fill={i < review.rating ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-card-foreground leading-relaxed">{review.comment}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
