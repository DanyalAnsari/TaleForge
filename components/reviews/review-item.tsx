"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { StarRating } from "./star-rating";
import { deleteReview } from "@/lib/actions/reviews";
import { formatDate } from "@/lib/utils";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";

interface ReviewItemProps {
	review: {
		id: string;
		rating: number;
		title: string | null;
		body: string;
		createdAt: Date;
		user: {
			id: string;
			name: string;
			image: string | null;
		};
	};
	currentUserId?: string;
	isAdmin?: boolean;
}

export function ReviewItem({
	review,
	currentUserId,
	isAdmin,
}: ReviewItemProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const canDelete = currentUserId === review.user.id || isAdmin;

	const initials = review.user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	function handleDelete() {
		startTransition(async () => {
			const result = await deleteReview(review.id);
			if (result.success) {
				setShowDeleteDialog(false);
				router.refresh();
			}
		});
	}

	return (
		<div className="py-6 border-b last:border-0">
			<div className="flex items-start justify-between gap-4">
				<div className="flex gap-3">
					<Avatar className="h-10 w-10">
						<AvatarImage src={review.user.image || undefined} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-medium">{review.user.name}</p>
						<div className="flex items-center gap-2 mt-1">
							<StarRating rating={review.rating} readonly size="sm" />
							<span className="text-xs text-muted-foreground">
								{formatDate(review.createdAt)}
							</span>
						</div>
					</div>
				</div>

				{canDelete && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
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

			<div className="mt-3 ml-13">
				{review.title && <h4 className="font-semibold mb-1">{review.title}</h4>}
				<p className="text-sm whitespace-pre-wrap">{review.body}</p>
			</div>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Review</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this review? This action cannot be
							undone.
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
