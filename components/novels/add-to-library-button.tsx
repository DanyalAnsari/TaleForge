"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addToLibrary, removeFromLibrary } from "@/lib/actions/library";
import { Library, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LoginPrompt } from "../auth/login-prompt";

interface AddToLibraryButtonProps {
	novelId: string;
	isInLibrary: boolean;
	isLoggedIn: boolean;
}

export function AddToLibraryButton({
	novelId,
	isInLibrary,
	isLoggedIn,
}: AddToLibraryButtonProps) {
	const [isPending, startTransition] = useTransition();
	const [inLibrary, setInLibrary] = useState(isInLibrary);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	async function handleClick() {
		if (!isLoggedIn) {
			toast.error("Please sign in to add novels to your library");
			setShowLoginPrompt(true);
			return;
		}

		startTransition(async () => {
			const result = inLibrary
				? await removeFromLibrary(novelId)
				: await addToLibrary(novelId);

			if (result.error) {
				toast.error(result.error);
			} else {
				setInLibrary(!inLibrary);
				toast.success(inLibrary ? "Removed from library" : "Added to library");
			}
		});
	}

	return (
		<>
			<Button
				onClick={handleClick}
				disabled={isPending}
				variant={inLibrary ? "secondary" : "outline"}
				className="w-full"
				size="lg"
			>
				{isPending ? (
					<Loader2 className="mr-2 h-5 w-5 animate-spin" />
				) : inLibrary ? (
					<Check className="mr-2 h-5 w-5" />
				) : (
					<Library className="mr-2 h-5 w-5" />
				)}
				{inLibrary ? "In Library" : "Add to Library"}
			</Button>
			<LoginPrompt
				open={showLoginPrompt}
				onOpenChange={setShowLoginPrompt}
				action="add novels to your library"
			/>
		</>
	);
}
