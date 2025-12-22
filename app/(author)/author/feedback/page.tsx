import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/reviews/star-rating";
import { formatDate } from "@/lib/utils";
import { MessageSquare, BookOpen, Star, TrendingUp } from "lucide-react";

async function getAuthorFeedback(authorId: string) {
	const reviews = await prisma.novelReview.findMany({
		where: {
			novel: {
				authorId,
			},
		},
		include: {
			user: {
				select: { name: true, image: true },
			},
			novel: {
				select: { id: true, title: true, slug: true, coverImageUrl: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});

	// Calculate stats
	const totalReviews = reviews.length;
	const averageRating =
		totalReviews > 0
			? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
			: 0;

	const ratingCounts = [0, 0, 0, 0, 0];
	reviews.forEach((r) => {
		ratingCounts[r.rating - 1]++;
	});

	return { reviews, totalReviews, averageRating, ratingCounts };
}

export default async function FeedbackPage() {
	const session = await getServerSession();

	if (!session) return null;

	const { reviews, totalReviews, averageRating, ratingCounts } =
		await getAuthorFeedback(session.user.id);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Reader Feedback</h1>
				<p className="text-muted-foreground mt-1">
					All reviews on your novels in one place
				</p>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
						<MessageSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalReviews}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Rating
						</CardTitle>
						<Star className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<span className="text-2xl font-bold">
								{averageRating.toFixed(1)}
							</span>
							<StarRating
								rating={Math.round(averageRating)}
								readonly
								size="sm"
							/>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Rating Breakdown
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-1 text-sm">
							{[5, 4, 3, 2, 1].map((rating) => (
								<div key={rating} className="flex items-center gap-1">
									<span className="text-xs text-muted-foreground">
										{rating}★
									</span>
									<Badge variant="secondary" className="text-xs">
										{ratingCounts[rating - 1]}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Reviews List */}
			{reviews.length > 0 ? (
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">All Reviews</h2>
					{reviews.map((review) => (
						<Card key={review.id}>
							<CardContent className="p-4">
								<div className="flex gap-4">
									{/* Novel Cover */}
									<Link
										href={`/novels/${review.novel.slug}`}
										className="relative w-12 h-16 shrink-0"
									>
										{review.novel.coverImageUrl ? (
											<Image
												src={review.novel.coverImageUrl}
												alt={review.novel.title}
												fill
												className="object-cover rounded"
												sizes="48px"
											/>
										) : (
											<div className="w-full h-full bg-muted rounded flex items-center justify-center">
												<BookOpen className="h-4 w-4 text-muted-foreground" />
											</div>
										)}
									</Link>

									{/* Review Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2">
											<div>
												<Link
													href={`/novels/${review.novel.slug}`}
													className="font-semibold hover:text-primary text-sm"
												>
													{review.novel.title}
												</Link>
												<div className="flex items-center gap-2 mt-1">
													<span className="text-sm text-muted-foreground">
														by {review.user.name}
													</span>
													<StarRating
														rating={review.rating}
														readonly
														size="sm"
													/>
												</div>
											</div>
											<span className="text-xs text-muted-foreground">
												{formatDate(review.createdAt)}
											</span>
										</div>

										{review.title && (
											<h4 className="font-medium mt-2 text-sm">
												{review.title}
											</h4>
										)}
										<p className="text-sm text-muted-foreground mt-1">
											{review.body}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">No reviews yet</h2>
						<p className="text-muted-foreground text-center max-w-md">
							Your novels haven&apos;t received any reviews yet. Keep writing
							and readers will share their feedback!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
