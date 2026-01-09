import { Star } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ReviewFormProps {
    onSubmit: (data: ReviewFormData) => void;
    isLoading?: boolean;
}

const reviewSchema = z.object({
    stars: z.number().min(1, "Vui lòng chọn số sao đánh giá"),
    content: z
        .string()
        .min(10, "Nội dung phải có ít nhất 10 ký tự")
        .max(1000, "Nội dung không được quá 1000 ký tự"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewForm = ({ onSubmit, isLoading = false }: ReviewFormProps) => {
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            stars: 0,
            content: "",
        },
    });

    const currentStars = watch("stars");

    const onFormSubmit = (data: ReviewFormData) => {
        onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <Card className="bg-card border-border">
                <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-card-foreground mb-4">Write a Review</h3>

                    {/* Star Rating */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Rating *
                        </label>
                        <Controller
                            name="stars"
                            control={control}
                            render={({ field }) => (
                                <div className="flex space-x-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => field.onChange(i + 1)}
                                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                                        >
                                            <Star
                                                className="w-6 h-6 text-tertiary cursor-pointer transition-transform hover:scale-110"
                                                strokeWidth={2}
                                                fill={i < currentStars ? 'currentColor' : 'none'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                        {errors.stars && (
                            <p className="text-red-500 text-sm mt-1">{errors.stars.message}</p>
                        )}
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Your Review *
                        </label>
                        <Textarea
                            {...register("content")}
                            placeholder="Share your experience..."
                            className="min-h-32 bg-background text-foreground border-border"
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                        )}
                    </div>

                    {/* AI Info Box */}
                    <div className="flex items-start gap-3 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#2563EB" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                        <p className="text-blue-800 dark:text-blue-300">
                            The AI system will analyze your review to determine how positive or negative it is and score it on a 100-point scale.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-primary-foreground hover:bg-secondary"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};

export default ReviewForm;