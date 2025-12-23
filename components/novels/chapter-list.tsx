import Link from "next/link";
import { formatDate, formatNumber } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Eye, Lock, FileText } from "lucide-react";

interface Chapter {
	id: string;
	title: string;
	chapterNumber: number;
	isPublished: boolean;
	views: number;
	createdAt: Date;
}

interface ChapterListProps {
	chapters: Chapter[];
	novelSlug: string;
}

export function ChapterList({ chapters, novelSlug }: ChapterListProps) {
	if (chapters.length === 0) {
		return (
			<EmptyState
				icon={FileText}
				title="No chapters yet"
				description="The author hasn't published any chapters yet. Check back soon!"
				className="py-8"
			/>
		);
	}

	return (
		<div className="divide-y">
			{chapters.map((chapter) => (
				<Link
					key={chapter.id}
					href={`/novels/${novelSlug}/chapter/${chapter.chapterNumber}`}
					className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors rounded-lg group"
				>
					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-muted-foreground w-12">
							Ch. {chapter.chapterNumber}
						</span>
						<span className="font-medium group-hover:text-primary transition-colors">
							{chapter.title}
						</span>
						{!chapter.isPublished && (
							<Lock className="h-4 w-4 text-muted-foreground" />
						)}
					</div>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span className="flex items-center gap-1">
							<Eye className="h-4 w-4" />
							{formatNumber(chapter.views)}
						</span>
						<span className="hidden sm:inline">
							{formatDate(chapter.createdAt)}
						</span>
					</div>
				</Link>
			))}
		</div>
	);
}
