"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
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
import { deleteChapter, toggleChapterPublish } from "@/lib/actions/chapters";
import {
	MoreVertical,
	Edit,
	Eye,
	EyeOff,
	ExternalLink,
	Trash2,
	Loader2,
} from "lucide-react";

interface ChapterActionsProps {
	chapterId: string;
	novelId: string;
	novelSlug: string;
	chapterNumber: number;
	isPublished: boolean;
}

export function ChapterActions({
	chapterId,
	novelId,
	novelSlug,
	chapterNumber,
	isPublished,
}: ChapterActionsProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [published, setPublished] = useState(isPublished);

	function handleTogglePublish() {
		startTransition(async () => {
			const result = await toggleChapterPublish(chapterId);
			if (result.success && typeof result.isPublished === "boolean") {
				setPublished(result.isPublished);
			}
		});
	}

	function handleDelete() {
		startTransition(async () => {
			const result = await deleteChapter(chapterId);
			if (result.success) {
				setShowDeleteDialog(false);
				router.refresh();
			}
		});
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" disabled={isPending}>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<MoreVertical className="h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link href={`/author/novels/${novelId}/chapters/${chapterId}`}>
							<Edit className="mr-2 h-4 w-4" />
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleTogglePublish}>
						{published ? (
							<>
								<EyeOff className="mr-2 h-4 w-4" />
								Unpublish
							</>
						) : (
							<>
								<Eye className="mr-2 h-4 w-4" />
								Publish
							</>
						)}
					</DropdownMenuItem>
					{published && (
						<DropdownMenuItem asChild>
							<Link
								href={`/novels/${novelSlug}/chapter/${chapterNumber}`}
								target="_blank"
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								View Live
							</Link>
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Chapter</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete Chapter {chapterNumber}? This
							action cannot be undone.
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
