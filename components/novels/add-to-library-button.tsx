// components/novels/add-to-library-button.tsx

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addToLibrary, removeFromLibrary } from "@/lib/actions/library";
import { Library, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [inLibrary, setInLibrary] = useState(isInLibrary);
	const [error, setError] = useState<string | null>(null);

	async function handleClick() {
		if (!isLoggedIn) {
			router.push("/login");
			return;
		}

		setError(null);

		startTransition(async () => {
			const result = inLibrary
				? await removeFromLibrary(novelId)
				: await addToLibrary(novelId);

			if (result.error) {
				setError(result.error);
			} else {
				setInLibrary(!inLibrary);
			}
		});
	}

	return (
		<div className="space-y-2">
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
			{error && <p className="text-sm text-destructive text-center">{error}</p>}
		</div>
	);
}
