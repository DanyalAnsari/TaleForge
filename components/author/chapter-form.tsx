"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createChapter, updateChapter } from "@/lib/actions/chapters";
import { Loader2 } from "lucide-react";

interface ChapterFormProps {
	novelId: string;
	chapter?: {
		id: string;
		title: string;
		content: string;
		chapterNumber: number;
		isPublished: boolean;
	};
}

export function ChapterForm({ novelId, chapter }: ChapterFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [isPublished, setIsPublished] = useState(chapter?.isPublished ?? false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		const data = {
			title: formData.get("title") as string,
			content: formData.get("content") as string,
			isPublished,
		};

		if (!data.title.trim()) {
			setError("Title is required");
			return;
		}

		if (!data.content.trim()) {
			setError("Content is required");
			return;
		}

		startTransition(async () => {
			const result = chapter
				? await updateChapter(chapter.id, data)
				: await createChapter(novelId, data);

			if (result.error) {
				setError(result.error);
			} else {
				router.push(`/author/novels/${novelId}/chapters`);
			}
		});
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>
						{chapter ? `Edit Chapter ${chapter.chapterNumber}` : "New Chapter"}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Chapter Title *</Label>
						<Input
							id="title"
							name="title"
							defaultValue={chapter?.title}
							placeholder="Enter chapter title"
							required
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="content">Content *</Label>
						<Textarea
							id="content"
							name="content"
							defaultValue={chapter?.content}
							placeholder="Write your chapter content here..."
							rows={20}
							className="font-mono"
							required
							disabled={isPending}
						/>
						<p className="text-xs text-muted-foreground">
							Separate paragraphs with blank lines for proper formatting
						</p>
					</div>

					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<Label htmlFor="publish">Publish Chapter</Label>
							<p className="text-sm text-muted-foreground">
								{isPublished
									? "Chapter will be visible to readers"
									: "Chapter will be saved as draft"}
							</p>
						</div>
						<Switch
							id="publish"
							checked={isPublished}
							onCheckedChange={setIsPublished}
							disabled={isPending}
						/>
					</div>
				</CardContent>
			</Card>

			<div className="flex gap-4">
				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{chapter ? "Saving..." : "Creating..."}
						</>
					) : chapter ? (
						"Save Changes"
					) : (
						"Create Chapter"
					)}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
					disabled={isPending}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
