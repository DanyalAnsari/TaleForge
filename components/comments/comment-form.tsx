"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createComment } from "@/lib/actions/comments";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface CommentFormProps {
	chapterId: string;
	user?: {
		id: string;
		name: string;
		image?: string | null;
	} | null;
}

export function CommentForm({ chapterId, user }: CommentFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [content, setContent] = useState("");
	const [error, setError] = useState<string | null>(null);

	if (!user) {
		return (
			<div className="text-center py-6 border rounded-lg bg-muted/30">
				<p className="text-muted-foreground mb-2">
					Sign in to join the discussion
				</p>
				<Button asChild>
					<Link href="/login">Sign In</Link>
				</Button>
			</div>
		);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!content.trim()) return;

		setError(null);
		startTransition(async () => {
			const result = await createComment(chapterId, content);
			if (result.error) {
				setError(result.error);
			} else {
				setContent("");
				router.refresh();
			}
		});
	}

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="flex gap-3">
				<Avatar className="h-10 w-10">
					<AvatarImage src={user.image || undefined} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<Textarea
						placeholder="Write a comment..."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						disabled={isPending}
						rows={3}
						className="resize-none"
					/>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<div className="flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							{content.length}/2000
						</span>
						<Button
							type="submit"
							disabled={isPending || !content.trim()}
							size="sm"
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Posting...
								</>
							) : (
								"Post Comment"
							)}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}
