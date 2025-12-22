"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
	rating: number;
	onRatingChange?: (rating: number) => void;
	readonly?: boolean;
	size?: "sm" | "md" | "lg";
}

export function StarRating({
	rating,
	onRatingChange,
	readonly = false,
	size = "md",
}: StarRatingProps) {
	const [hoverRating, setHoverRating] = useState(0);

	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	};

	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => {
				const filled = readonly
					? star <= rating
					: star <= (hoverRating || rating);

				return (
					<button
						key={star}
						type="button"
						disabled={readonly}
						onClick={() => onRatingChange?.(star)}
						onMouseEnter={() => !readonly && setHoverRating(star)}
						onMouseLeave={() => !readonly && setHoverRating(0)}
						className={cn(
							"transition-colors",
							readonly ? "cursor-default" : "cursor-pointer"
						)}
					>
						<Star
							className={cn(
								sizeClasses[size],
								filled
									? "fill-yellow-400 text-yellow-400"
									: "text-muted-foreground"
							)}
						/>
					</button>
				);
			})}
		</div>
	);
}
