"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { createReview, updateReview } from "@/lib/actions/reviews";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ReviewFormProps {
	novelId: string;
	user?: {
		id: string;
		name: string;
	} | null;
	existingReview?: {
		id: string;
		rating: number;
		title: string | null;
		body: string;
	} | null;
	isAuthor?: boolean;
}

export function ReviewForm({
	novelId,
	user,
	existingReview,
	isAuthor,
}: ReviewFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [rating, setRating] = useState(existingReview?.rating || 0);
	const [title, setTitle] = useState(existingReview?.title || "");
	const [body, setBody] = useState(existingReview?.body || "");
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(!existingReview);

	if (!user) {
		return (
			<Card>
				<CardContent className="text-center py-6">
					<p className="text-muted-foreground mb-2">
						Sign in to write a review
					</p>
					<Button asChild>
						<Link href="/login">Sign In</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (isAuthor) {
		return (
			<Card>
				<CardContent className="text-center py-6 text-muted-foreground">
					You cannot review your own novel.
				</CardContent>
			</Card>
		);
	}

	if (existingReview && !isEditing) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Your Review</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<StarRating rating={existingReview.rating} readonly />
					{existingReview.title && (
						<h4 className="font-semibold">{existingReview.title}</h4>
					)}
					<p className="text-sm whitespace-pre-wrap">{existingReview.body}</p>
					<Button variant="outline" onClick={() => setIsEditing(true)}>
						Edit Review
					</Button>
				</CardContent>
			</Card>
		);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (rating === 0) {
			setError("Please select a rating");
			return;
		}

		if (!body.trim()) {
			setError("Please write a review");
			return;
		}

		setError(null);
		startTransition(async () => {
			const data = { rating, title: title.trim(), body: body.trim() };
			const result = existingReview
				? await updateReview(existingReview.id, data)
				: await createReview(novelId, data);

			if (result.error) {
				setError(result.error);
			} else {
				if (!existingReview) {
					setRating(0);
					setTitle("");
					setBody("");
				}
				setIsEditing(false);
				router.refresh();
			}
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">
					{existingReview ? "Edit Your Review" : "Write a Review"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label>Your Rating *</Label>
						<StarRating rating={rating} onRatingChange={setRating} size="lg" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="review-title">Title (optional)</Label>
						<Input
							id="review-title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Summarize your experience"
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="review-body">Your Review *</Label>
						<Textarea
							id="review-body"
							value={body}
							onChange={(e) => setBody(e.target.value)}
							placeholder="Tell others what you think about this novel..."
							rows={5}
							disabled={isPending}
						/>
						<p className="text-xs text-muted-foreground">
							{body.length}/5000 characters
						</p>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<div className="flex gap-2">
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{existingReview ? "Saving..." : "Submitting..."}
								</>
							) : existingReview ? (
								"Save Changes"
							) : (
								"Submit Review"
							)}
						</Button>
						{existingReview && (
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setRating(existingReview.rating);
									setTitle(existingReview.title || "");
									setBody(existingReview.body);
									setIsEditing(false);
								}}
								disabled={isPending}
							>
								Cancel
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
