"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteNovel } from "@/lib/actions/novels";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteNovelButtonProps {
	novelId: string;
	novelTitle: string;
}

export function DeleteNovelButton({
	novelId,
	novelTitle,
}: DeleteNovelButtonProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const [confirmText, setConfirmText] = useState("");
	const [error, setError] = useState<string | null>(null);

	const canDelete = confirmText === novelTitle;

	function handleDelete() {
		if (!canDelete) return;

		startTransition(async () => {
			const result = await deleteNovel(novelId);

			if (result.error) {
				setError(result.error);
			} else {
				setOpen(false);
				router.push("/author/novels");
			}
		});
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="w-full">
					<Trash2 className="mr-2 h-4 w-4" />
					Delete Novel
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Novel</AlertDialogTitle>
					<AlertDialogDescription className="space-y-4">
						<p>
							This action cannot be undone. This will permanently delete the
							novel <strong>&quot;{novelTitle}&quot;</strong> and all its
							chapters.
						</p>
						<div className="space-y-2">
							<Label htmlFor="confirm">
								Type <strong>{novelTitle}</strong> to confirm:
							</Label>
							<Input
								id="confirm"
								value={confirmText}
								onChange={(e) => setConfirmText(e.target.value)}
								placeholder="Enter novel title"
							/>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setConfirmText("")}>
						Cancel
					</AlertDialogCancel>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={!canDelete || isPending}
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Delete Novel"
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
