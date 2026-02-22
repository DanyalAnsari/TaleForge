import { NovelCard } from "./novel-card";
import { BookOpen } from "lucide-react";
import Link from "next/link";

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
			<div className="forge-empty-state">
				<BookOpen className="forge-empty-state-icon" strokeWidth={1.75} />
				<p className="forge-empty-state-title">No novels found</p>
				<p className="forge-empty-state-description">{emptyMessage}</p>
				{emptyAction && (
					<Link
						href={emptyAction.href}
						className="forge-btn-ghost forge-focus-ring mt-6 inline-flex items-center px-6 py-2 text-sm transition-colors duration-(--duration-fast)"
					>
						{emptyAction.label}
					</Link>
				)}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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