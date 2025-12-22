"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { StarRating } from "@/components/reviews/star-rating";
import { updateReview, deleteReview } from "@/lib/actions/reviews";
import { formatDate } from "@/lib/utils";
import { Trash2, Loader2, BookOpen, ExternalLink, Edit } from "lucide-react";
import { toast } from "sonner";

interface UserReviewItemProps {
	review: {
		id: string;
		rating: number;
		title: string | null;
		body: string;
		createdAt: Date;
		novel: {
			id: string;
			title: string;
			slug: string;
			coverImageUrl: string | null;
		};
	};
}

export function UserReviewItem({ review }: UserReviewItemProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);

	// Edit form state
	const [editRating, setEditRating] = useState(review.rating);
	const [editTitle, setEditTitle] = useState(review.title || "");
	const [editBody, setEditBody] = useState(review.body);

	function handleDelete() {
		startTransition(async () => {
			const result = await deleteReview(review.id);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Review deleted");
				setShowDeleteDialog(false);
				router.refresh();
			}
		});
	}

	function handleEdit() {
		if (editRating === 0) {
			toast.error("Please select a rating");
			return;
		}

		if (!editBody.trim()) {
			toast.error("Please write a review");
			return;
		}

		startTransition(async () => {
			const result = await updateReview(review.id, {
				rating: editRating,
				title: editTitle,
				body: editBody,
			});

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Review updated");
				setShowEditDialog(false);
				router.refresh();
			}
		});
	}

	return (
		<>
			<Card>
				<CardContent className="p-4">
					<div className="flex gap-4">
						{/* Novel Cover */}
						<Link
							href={`/novels/${review.novel.slug}`}
							className="relative w-16 h-24 shrink-0"
						>
							{review.novel.coverImageUrl ? (
								<Image
									src={review.novel.coverImageUrl}
									alt={review.novel.title}
									fill
									className="object-cover rounded"
									sizes="64px"
								/>
							) : (
								<div className="w-full h-full bg-muted rounded flex items-center justify-center">
									<BookOpen className="h-6 w-6 text-muted-foreground" />
								</div>
							)}
						</Link>

						{/* Review Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2">
								<div>
									<Link
										href={`/novels/${review.novel.slug}`}
										className="font-semibold hover:text-primary line-clamp-1"
									>
										{review.novel.title}
									</Link>
									<div className="flex items-center gap-2 mt-1">
										<StarRating rating={review.rating} readonly size="sm" />
										<span className="text-xs text-muted-foreground">
											{formatDate(review.createdAt)}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<Button variant="ghost" size="icon" asChild>
										<Link href={`/novels/${review.novel.slug}`}>
											<ExternalLink className="h-4 w-4" />
										</Link>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setShowEditDialog(true)}
									>
										<Edit className="h-4 w-4" />
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

							{review.title && (
								<h4 className="font-medium mt-2">{review.title}</h4>
							)}
							<p className="text-sm text-muted-foreground mt-1 line-clamp-3">
								{review.body}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Delete Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Review</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete your review for &quot;
							{review.novel.title}&quot;? This action cannot be undone.
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

			{/* Edit Dialog */}
			<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Review</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Rating</Label>
							<StarRating
								rating={editRating}
								onRatingChange={setEditRating}
								size="lg"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-title">Title (optional)</Label>
							<Input
								id="edit-title"
								value={editTitle}
								onChange={(e) => setEditTitle(e.target.value)}
								disabled={isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-body">Review</Label>
							<Textarea
								id="edit-body"
								value={editBody}
								onChange={(e) => setEditBody(e.target.value)}
								rows={5}
								disabled={isPending}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowEditDialog(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button onClick={handleEdit} disabled={isPending}>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Save Changes"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
