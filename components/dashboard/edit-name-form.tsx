"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserName } from "@/lib/actions/user";
import { Loader2, Check, X, Pencil } from "lucide-react";
import { toast } from "sonner";

interface EditNameFormProps {
	currentName: string;
}

export function EditNameForm({ currentName }: EditNameFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(currentName);

	function handleCancel() {
		setName(currentName);
		setIsEditing(false);
	}

	function handleSave() {
		if (!name.trim() || name === currentName) {
			handleCancel();
			return;
		}

		startTransition(async () => {
			const result = await updateUserName(name);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Name updated successfully");
				setIsEditing(false);
				router.refresh();
			}
		});
	}

	if (!isEditing) {
		return (
			<div className="flex items-center gap-2">
				<span className="font-medium">{currentName}</span>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => setIsEditing(true)}
				>
					<Pencil className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Input
				value={name}
				onChange={(e) => setName(e.target.value)}
				disabled={isPending}
				className="max-w-50"
				autoFocus
				onKeyDown={(e) => {
					if (e.key === "Enter") handleSave();
					if (e.key === "Escape") handleCancel();
				}}
			/>
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8"
				onClick={handleSave}
				disabled={isPending}
			>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Check className="h-4 w-4" />
				)}
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8"
				onClick={handleCancel}
				disabled={isPending}
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}
