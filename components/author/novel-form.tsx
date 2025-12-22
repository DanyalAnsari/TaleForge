// components/author/novel-form.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { createNovel, updateNovel } from "@/lib/actions/novels";
import { Loader2, X } from "lucide-react";

interface Tag {
	id: string;
	name: string;
	slug: string;
}

interface NovelFormProps {
	novel?: {
		id: string;
		title: string;
		description: string;
		coverImageUrl: string | null;
		status: string;
		tags: { tag: Tag }[];
	};
	tags: Tag[];
}

export function NovelForm({ novel, tags }: NovelFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [selectedTags, setSelectedTags] = useState<string[]>(
		novel?.tags.map((t) => t.tag.id) || []
	);

	function toggleTag(tagId: string) {
		setSelectedTags((prev) =>
			prev.includes(tagId)
				? prev.filter((id) => id !== tagId)
				: [...prev, tagId]
		);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		const data = {
			title: formData.get("title") as string,
			description: formData.get("description") as string,
			coverImageUrl: formData.get("coverImageUrl") as string,
			status: formData.get("status") as "ONGOING" | "COMPLETED" | "HIATUS",
			tagIds: selectedTags,
		};

		if (!data.title.trim()) {
			setError("Title is required");
			return;
		}

		if (!data.description.trim()) {
			setError("Description is required");
			return;
		}

		startTransition(async () => {
			const result = novel
				? await updateNovel(novel.id, data)
				: await createNovel(data);

			if (result.error) {
				setError(result.error);
			} else if ("novelId" in result && result.novelId) {
				router.push(`/author/novels/${result.novelId}`);
			} else {
				router.push("/author/novels");
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
					<CardTitle>Basic Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							name="title"
							defaultValue={novel?.title}
							placeholder="Enter novel title"
							required
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description *</Label>
						<Textarea
							id="description"
							name="description"
							defaultValue={novel?.description}
							placeholder="Enter a compelling description for your novel..."
							rows={6}
							required
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="coverImageUrl">Cover Image URL</Label>
						<Input
							id="coverImageUrl"
							name="coverImageUrl"
							type="url"
							defaultValue={novel?.coverImageUrl || ""}
							placeholder="https://example.com/cover.jpg"
							disabled={isPending}
						/>
						<p className="text-xs text-muted-foreground">
							Enter a URL to an image for your novel cover
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select
							name="status"
							defaultValue={novel?.status || "ONGOING"}
							disabled={isPending}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ONGOING">Ongoing</SelectItem>
								<SelectItem value="COMPLETED">Completed</SelectItem>
								<SelectItem value="HIATUS">Hiatus</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Tags</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							Select tags that best describe your novel
						</p>
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => {
								const isSelected = selectedTags.includes(tag.id);
								return (
									<button
										key={tag.id}
										type="button"
										onClick={() => toggleTag(tag.id)}
										disabled={isPending}
										className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
											isSelected
												? "bg-primary text-primary-foreground"
												: "bg-muted hover:bg-muted/80"
										}`}
									>
										{tag.name}
										{isSelected && <X className="ml-1 h-3 w-3" />}
									</button>
								);
							})}
						</div>
						{selectedTags.length > 0 && (
							<p className="text-sm text-muted-foreground">
								{selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}{" "}
								selected
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			<div className="flex gap-4">
				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{novel ? "Saving..." : "Creating..."}
						</>
					) : novel ? (
						"Save Changes"
					) : (
						"Create Novel"
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
