import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserReviewItem } from "@/components/dashboard/user-review-item";
import { Star, BookOpen } from "lucide-react";

async function getUserReviews(userId: string) {
	return prisma.novelReview.findMany({
		where: { userId },
		include: {
			novel: {
				select: {
					id: true,
					title: true,
					slug: true,
					coverImageUrl: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

export default async function MyReviewsPage() {
	const session = await getServerSession();

	if (!session) return null;

	const reviews = await getUserReviews(session.user.id);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">My Reviews</h1>
				<p className="text-muted-foreground mt-1">
					{reviews.length} review{reviews.length !== 1 ? "s" : ""} written
				</p>
			</div>

			{reviews.length > 0 ? (
				<div className="space-y-4">
					{reviews.map((review) => (
						<UserReviewItem key={review.id} review={review} />
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<Star className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">No reviews yet</h2>
						<p className="text-muted-foreground text-center mb-6 max-w-md">
							You haven&apos;t written any reviews yet. Share your thoughts on
							the novels you&apos;ve read!
						</p>
						<Button asChild>
							<Link href="/novels">
								<BookOpen className="mr-2 h-4 w-4" />
								Browse Novels
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
