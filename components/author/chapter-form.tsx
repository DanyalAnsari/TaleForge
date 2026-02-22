// components/chapters/chapter-form.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createChapter, updateChapter } from "@/lib/actions/chapters";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/author/rich-text-editor";

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
	const [content, setContent] = useState(chapter?.content ?? "");

	const handleContentChange = useCallback((html: string) => {
		setContent(html);
	}, []);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		const title = formData.get("title") as string;

		if (!title.trim()) {
			setError("Title is required");
			return;
		}

		// Strip HTML tags to check if there's actual text content
		const textOnly = content.replace(/<[^>]*>/g, "").trim();
		if (!textOnly) {
			setError("Content is required");
			return;
		}

		const data = {
			title,
			content, // This is now HTML from the rich text editor
			isPublished,
		};

		startTransition(async () => {
			const result =
				chapter ?
					await updateChapter(chapter.id, data)
				:	await createChapter(novelId, data);

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
						<Label>Content *</Label>
						<RichTextEditor
							content={chapter?.content ?? ""}
							onChange={handleContentChange}
							disabled={isPending}
							placeholder="Begin writing your chapter..."
						/>
					</div>

					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<Label htmlFor="publish">Publish Chapter</Label>
							<p className="text-sm text-muted-foreground">
								{isPublished ?
									"Chapter will be visible to readers"
								:	"Chapter will be saved as draft"}
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
					{isPending ?
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{chapter ? "Saving..." : "Creating..."}
						</>
					: chapter ?
						"Save Changes"
					:	"Create Chapter"}
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
