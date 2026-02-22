import Link from "next/link";
import Image from "next/image";
import { BookOpen, Star, Bookmark } from "lucide-react";

interface NovelCardProps {
	novel: {
		id: string;
		title: string;
		slug: string;
		description: string;
		coverImageUrl: string | null;
		status: string;
		views: number;
		rating?: number;
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
	};
	isInLibrary?: boolean;
}

export function NovelCard({ novel, isInLibrary = false }: NovelCardProps) {
	const statusClass: Record<string, string> = {
		ONGOING: "forge-status-ongoing",
		COMPLETED: "forge-status-completed",
		HIATUS: "forge-status-hiatus",
	};

	return (
		<Link
			href={`/novels/${novel.slug}`}
			className="forge-card forge-card-glow overflow-hidden group forge-focus-ring block"
		>
			{/* Cover image area */}
			<div className="aspect-[3/4] overflow-hidden relative">
				{novel.coverImageUrl ? (
					<Image
						src={novel.coverImageUrl}
						alt={novel.title}
						fill
						className="object-cover w-full h-full transition-transform duration-[var(--duration-medium)] group-hover:scale-105"
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
					/>
				) : (
					<div className="forge-cover-placeholder w-full h-full flex items-center justify-center">
						<BookOpen className="h-12 w-12 text-forge-gold opacity-50" />
					</div>
				)}

				{/* Chapter count badge */}
				<div className="absolute top-2 right-2">
					<span className="font-mono text-[10px] bg-[oklch(0_0_0_/_60%)] text-white backdrop-blur-sm px-2 py-0.5 rounded-full">
						{novel._count.chapters} ch
					</span>
				</div>

				{/* Library indicator */}
				{isInLibrary && (
					<div className="absolute top-2 left-2">
						<Bookmark
							className="h-5 w-5 text-forge-gold fill-forge-gold drop-shadow-md"
						/>
					</div>
				)}

				{/* Status badge */}
				<div className="absolute bottom-2 left-2">
					<span
						className={
							statusClass[novel.status as keyof typeof statusClass] ??
							"forge-status-ongoing"
						}
					>
						{novel.status}
					</span>
				</div>
			</div>

			{/* Content area */}
			<div className="p-4">
				<h3 className="font-serif font-semibold text-[1.05rem] leading-snug line-clamp-2 text-foreground mb-1">
					{novel.title}
				</h3>

				<p className="font-sans text-xs text-muted-foreground mb-2">
					by {novel.author.name}
				</p>

				{/* Meta row */}
				<div className="font-mono text-[0.7rem] text-muted-foreground flex gap-3 mb-2">
					{novel.rating !== undefined && novel.rating > 0 && (
						<span className="flex items-center gap-0.5">
							<Star
								className="text-forge-gold fill-current"
								style={{ width: "10px", height: "10px" }}
							/>
							{novel.rating.toFixed(1)}
						</span>
					)}
					<span className="flex items-center gap-0.5">
						<BookOpen
							className="text-muted-foreground"
							style={{ width: "10px", height: "10px" }}
						/>
						{novel._count.chapters} chapters
					</span>
				</div>

				{/* Tags row */}
				{novel.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{novel.tags.slice(0, 3).map(({ tag }) => (
							<span key={tag.slug} className="forge-badge-genre">
								{tag.name}
							</span>
						))}
					</div>
				)}
			</div>
		</Link>
	);
}