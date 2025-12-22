"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateComment, deleteComment } from "@/lib/actions/comments";
import { formatDate } from "@/lib/utils";
import { MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";

interface CommentItemProps {
	comment: {
		id: string;
		content: string;
		createdAt: Date;
		updatedAt: Date;
		user: {
			id: string;
			name: string;
			image: string | null;
		};
	};
	currentUserId?: string;
	isAdmin?: boolean;
}

export function CommentItem({
	comment,
	currentUserId,
	isAdmin,
}: CommentItemProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const canModify = currentUserId === comment.user.id || isAdmin;
	const isEdited = comment.updatedAt > comment.createdAt;

	const initials = comment.user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	function handleUpdate() {
		if (!editContent.trim()) return;

		setError(null);
		startTransition(async () => {
			const result = await updateComment(comment.id, editContent);
			if (result.error) {
				setError(result.error);
			} else {
				setIsEditing(false);
				router.refresh();
			}
		});
	}

	function handleDelete() {
		startTransition(async () => {
			const result = await deleteComment(comment.id);
			if (result.error) {
				setError(result.error);
			} else {
				setShowDeleteDialog(false);
				router.refresh();
			}
		});
	}

	return (
		<div className="flex gap-3 py-4">
			<Avatar className="h-10 w-10">
				<AvatarImage src={comment.user.image || undefined} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>

			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<span className="font-medium">{comment.user.name}</span>
						<span className="text-xs text-muted-foreground">
							{formatDate(comment.createdAt)}
							{isEdited && " (edited)"}
						</span>
					</div>

					{canModify && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => {
										setEditContent(comment.content);
										setIsEditing(true);
									}}
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setShowDeleteDialog(true)}
									className="text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>

				{isEditing ? (
					<div className="mt-2 space-y-2">
						<Textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							disabled={isPending}
							rows={3}
							className="resize-none"
						/>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handleUpdate}
								disabled={isPending || !editContent.trim()}
							>
								{isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Save"
								)}
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setIsEditing(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
				)}
			</div>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Comment</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this comment? This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={isPending}
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
