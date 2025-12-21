// components/dashboard/remove-from-library-button.tsx

"use client";

import { useState, useTransition } from "react";
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
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { removeFromLibrary } from "@/lib/actions/library";
import { Trash2, Loader2 } from "lucide-react";

interface RemoveFromLibraryButtonProps {
	novelId: string;
}

export function RemoveFromLibraryButton({
	novelId,
}: RemoveFromLibraryButtonProps) {
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

	function handleRemove() {
		startTransition(async () => {
			await removeFromLibrary(novelId);
			setOpen(false);
		});
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					size="sm"
					variant="ghost"
					className="text-destructive hover:text-destructive"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove from library?</AlertDialogTitle>
					<AlertDialogDescription>
						This will remove the novel from your library and clear your reading
						progress. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleRemove}
						disabled={isPending}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Remove"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
