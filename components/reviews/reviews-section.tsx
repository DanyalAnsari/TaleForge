import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RatingSummary } from "./rating-summary";
import { ReviewForm } from "./review-form";
import { ReviewItem } from "./review-item";
import { Star } from "lucide-react";

interface ReviewsSectionProps {
	novelId: string;
	authorId: string;
}

async function getReviews(novelId: string) {
	const reviews = await prisma.novelReview.findMany({
		where: { novelId },
		include: {
			user: {
				select: { id: true, name: true, image: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});

	// Calculate rating distribution
	const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
		rating,
		count: reviews.filter((r) => r.rating === rating).length,
	}));

	// Calculate average
	const averageRating =
		reviews.length > 0
			? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
			: 0;

	return { reviews, ratingDistribution, averageRating };
}

export async function ReviewsSection({
	novelId,
	authorId,
}: ReviewsSectionProps) {
	const [{ reviews, ratingDistribution, averageRating }, session] =
		await Promise.all([getReviews(novelId), getServerSession()]);

	const userRole = session?.user?.role;
	const isAdmin = userRole === "ADMIN";
	const isAuthor = session?.user?.id === authorId;

	const userReview = session
		? reviews.find((r) => r.user.id === session.user.id)
		: null;

	const otherReviews = reviews.filter((r) => r.user.id !== session?.user?.id);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Star className="h-5 w-5" />
					Reviews ({reviews.length})
				</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent className="pt-6 space-y-6">
				{/* Rating Summary */}
				{reviews.length > 0 && (
					<RatingSummary
						averageRating={averageRating}
						totalReviews={reviews.length}
						ratingDistribution={ratingDistribution}
					/>
				)}

				{/* Review Form */}
				<ReviewForm
					novelId={novelId}
					user={
						session?.user
							? { id: session.user.id, name: session.user.name }
							: null
					}
					existingReview={userReview}
					isAuthor={isAuthor}
				/>

				{/* Reviews List */}
				{otherReviews.length > 0 && (
					<div>
						<h3 className="font-semibold mb-4">All Reviews</h3>
						<div>
							{otherReviews.map((review) => (
								<ReviewItem
									key={review.id}
									review={review}
									currentUserId={session?.user?.id}
									isAdmin={isAdmin}
								/>
							))}
						</div>
					</div>
				)}

				{reviews.length === 0 && (
					<div className="text-center py-8 text-muted-foreground">
						No reviews yet. Be the first to review this novel!
					</div>
				)}
			</CardContent>
		</Card>
	);
}
