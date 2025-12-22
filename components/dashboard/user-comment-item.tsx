"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { deleteComment } from "@/lib/actions/comments";
import { formatDate } from "@/lib/utils";
import { Trash2, Loader2, BookOpen, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface UserCommentItemProps {
	comment: {
		id: string;
		content: string;
		createdAt: Date;
		chapter: {
			title: string;
			chapterNumber: number;
			novel: {
				title: string;
				slug: string;
			};
		};
	};
}

export function UserCommentItem({ comment }: UserCommentItemProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	function handleDelete() {
		startTransition(async () => {
			const result = await deleteComment(comment.id);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Comment deleted");
				setShowDeleteDialog(false);
				router.refresh();
			}
		});
	}

	return (
		<>
			<Card>
				<CardContent className="p-4">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
								<BookOpen className="h-4 w-4" />
								<Link
									href={`/novels/${comment.chapter.novel.slug}`}
									className="hover:text-primary truncate"
								>
									{comment.chapter.novel.title}
								</Link>
								<span>•</span>
								<Link
									href={`/novels/${comment.chapter.novel.slug}/chapter/${comment.chapter.chapterNumber}`}
									className="hover:text-primary"
								>
									Chapter {comment.chapter.chapterNumber}
								</Link>
							</div>
							<p className="text-sm line-clamp-3">{comment.content}</p>
							<p className="text-xs text-muted-foreground mt-2">
								{formatDate(comment.createdAt)}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="icon" asChild>
								<Link
									href={`/novels/${comment.chapter.novel.slug}/chapter/${comment.chapter.chapterNumber}`}
								>
									<ExternalLink className="h-4 w-4" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setShowDeleteDialog(true)}
								className="text-destructive hover:text-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

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
		</>
	);
}
