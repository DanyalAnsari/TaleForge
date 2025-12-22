import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { MessageSquare } from "lucide-react";

interface CommentsSectionProps {
	chapterId: string;
}

async function getComments(chapterId: string) {
	return prisma.chapterComment.findMany({
		where: { chapterId },
		include: {
			user: {
				select: { id: true, name: true, image: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

export async function CommentsSection({ chapterId }: CommentsSectionProps) {
	const [comments, session] = await Promise.all([
		getComments(chapterId),
		getServerSession(),
	]);

	const userRole = session?.user?.role;
	const isAdmin = userRole === "ADMIN";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5" />
					Comments ({comments.length})
				</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent className="pt-6 space-y-6">
				<CommentForm
					chapterId={chapterId}
					user={
						session?.user
							? {
									id: session.user.id,
									name: session.user.name,
									image: session.user.image,
							  }
							: null
					}
				/>
				<CommentList
					comments={comments}
					currentUserId={session?.user?.id}
					isAdmin={isAdmin}
				/>
			</CardContent>
		</Card>
	);
}
