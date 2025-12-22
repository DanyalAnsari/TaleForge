import { NovelCard } from "./novel-card";

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
}

export function NovelGrid({ novels, libraryNovelIds = [] }: NovelGridProps) {
	if (novels.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">No novels found.</p>
			</div>
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
