import { CommentItem } from "./comment-item";

interface Comment {
	id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	user: {
		id: string;
		name: string;
		image: string | null;
	};
}

interface CommentListProps {
	comments: Comment[];
	currentUserId?: string;
	isAdmin?: boolean;
}

export function CommentList({
	comments,
	currentUserId,
	isAdmin,
}: CommentListProps) {
	if (comments.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				No comments yet. Be the first to comment!
			</div>
		);
	}

	return (
		<div className="divide-y">
			{comments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					currentUserId={currentUserId}
					isAdmin={isAdmin}
				/>
			))}
		</div>
	);
}
