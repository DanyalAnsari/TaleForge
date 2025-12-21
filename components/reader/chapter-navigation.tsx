// components/reader/chapter-navigation.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

interface ChapterNavigationProps {
	novelSlug: string;
	currentChapter: number;
	totalChapters: number;
	prevChapter: number | null;
	nextChapter: number | null;
}

export function ChapterNavigation({
	novelSlug,
	currentChapter,
	totalChapters,
	prevChapter,
	nextChapter,
}: ChapterNavigationProps) {
	return (
		<div className="flex items-center justify-between gap-4">
			<Button
				variant="outline"
				asChild
				disabled={!prevChapter}
				className={!prevChapter ? "pointer-events-none opacity-50" : ""}
			>
				{prevChapter ? (
					<Link href={`/novels/${novelSlug}/chapter/${prevChapter}`}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Previous
					</Link>
				) : (
					<span>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Previous
					</span>
				)}
			</Button>

			<Button variant="ghost" asChild>
				<Link href={`/novels/${novelSlug}`}>
					<List className="mr-2 h-4 w-4" />
					<span className="hidden sm:inline">Chapter List</span>
					<span className="sm:hidden">
						{currentChapter}/{totalChapters}
					</span>
				</Link>
			</Button>

			<Button
				variant="outline"
				asChild
				disabled={!nextChapter}
				className={!nextChapter ? "pointer-events-none opacity-50" : ""}
			>
				{nextChapter ? (
					<Link href={`/novels/${novelSlug}/chapter/${nextChapter}`}>
						Next
						<ChevronRight className="ml-2 h-4 w-4" />
					</Link>
				) : (
					<span>
						Next
						<ChevronRight className="ml-2 h-4 w-4" />
					</span>
				)}
			</Button>
		</div>
	);
}
