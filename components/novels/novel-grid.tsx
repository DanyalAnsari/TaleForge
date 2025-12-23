import { NovelCard } from "./novel-card";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";

interface Novel {
	id: string;
	title: string;
	slug: string;
	description: string;
	coverImageUrl: string | null;
	status: string;
	views: number;
	updatedAt: Date;
	author: {
		name: string;
	};
	tags: {
		tag: {
			name: string;
			slug: string;
		};
	}[];
	_count: {
		chapters: number;
	};
}

interface NovelGridProps {
	novels: Novel[];
	libraryNovelIds?: string[];
	emptyMessage?: string;
	emptyAction?: {
		label: string;
		href: string;
	};
}

export function NovelGrid({
	novels,
	libraryNovelIds = [],
	emptyMessage = "No novels found. Check back later for new stories!",
	emptyAction,
}: NovelGridProps) {
	if (novels.length === 0) {
		return (
			<EmptyState
				icon={BookOpen}
				title="No novels found"
				description={emptyMessage}
				action={emptyAction}
			/>
		);
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
			{novels.map((novel) => (
				<NovelCard
					key={novel.id}
					novel={novel}
					isInLibrary={libraryNovelIds.includes(novel.id)}
				/>
			))}
		</div>
	);
}
