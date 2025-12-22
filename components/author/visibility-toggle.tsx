"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toggleNovelVisibility } from "@/lib/actions/novels";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface VisibilityToggleProps {
	novelId: string;
	isVisible: boolean;
}

export function VisibilityToggle({
	novelId,
	isVisible,
}: VisibilityToggleProps) {
	const [isPending, startTransition] = useTransition();
	const [visible, setVisible] = useState(isVisible);

	function handleToggle() {
		startTransition(async () => {
			const result = await toggleNovelVisibility(novelId);
			if (result.success && typeof result.isVisible === "boolean") {
				setVisible(result.isVisible);
			}
		});
	}

	return (
		<div className="flex items-center justify-between">
			<div className="space-y-1">
				<Label htmlFor="visibility" className="flex items-center gap-2">
					{visible ? (
						<Eye className="h-4 w-4 text-green-500" />
					) : (
						<EyeOff className="h-4 w-4 text-muted-foreground" />
					)}
					{visible ? "Published" : "Hidden"}
				</Label>
				<p className="text-xs text-muted-foreground">
					{visible
						? "Your novel is visible to readers"
						: "Your novel is hidden from readers"}
				</p>
			</div>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Switch
					id="visibility"
					checked={visible}
					onCheckedChange={handleToggle}
				/>
			)}
		</div>
	);
}
