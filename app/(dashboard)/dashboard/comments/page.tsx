import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCommentItem } from "@/components/dashboard/user-comment-item";
import { MessageSquare, BookOpen } from "lucide-react";

async function getUserComments(userId: string) {
	return prisma.chapterComment.findMany({
		where: { userId },
		include: {
			chapter: {
				select: {
					title: true,
					chapterNumber: true,
					novel: {
						select: {
							title: true,
							slug: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

export default async function MyCommentsPage() {
	const session = await getServerSession();

	if (!session) return null;

	const comments = await getUserComments(session.user.id);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">My Comments</h1>
				<p className="text-muted-foreground mt-1">
					{comments.length} comment{comments.length !== 1 ? "s" : ""} posted
				</p>
			</div>

			{comments.length > 0 ? (
				<div className="space-y-4">
					{comments.map((comment) => (
						<UserCommentItem key={comment.id} comment={comment} />
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">No comments yet</h2>
						<p className="text-muted-foreground text-center mb-6 max-w-md">
							You haven&apos;t posted any comments yet. Start reading and join
							the discussion!
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
