import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, BookOpen, Library } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface NovelCardProps {
	novel: {
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
	};
	isInLibrary?: boolean;
}

function timeAgo(date: Date): string {
	const now = new Date();
	const diff = now.getTime() - new Date(date).getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (days === 0) return "Today";
	if (days === 1) return "Yesterday";
	if (days < 7) return `${days} days ago`;
	if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
	if (days < 365) return `${Math.floor(days / 30)} months ago`;
	return `${Math.floor(days / 365)} years ago`;
}

export function NovelCard({ novel, isInLibrary = false }: NovelCardProps) {
	const statusColors = {
		ONGOING: "bg-green-500/10 text-green-500 border-green-500/20",
		COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		HIATUS: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	};

	return (
		<Link href={`/novels/${novel.slug}`}>
			<Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
				<div className="relative aspect-2/3 overflow-hidden">
					{novel.coverImageUrl ? (
						<Image
							src={novel.coverImageUrl}
							alt={novel.title}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-300"
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
						/>
					) : (
						<div className="w-full h-full bg-muted flex items-center justify-center">
							<BookOpen className="h-12 w-12 text-muted-foreground" />
						</div>
					)}
					<div className="absolute top-2 right-2">
						<Badge
							variant="outline"
							className={
								statusColors[novel.status as keyof typeof statusColors]
							}
						>
							{novel.status}
						</Badge>
					</div>
					{/* Library Badge */}
					{isInLibrary && (
						<div className="absolute top-2 left-2">
							<div className="bg-primary text-primary-foreground p-1.5 rounded-full">
								<Library className="h-3 w-3" />
							</div>
						</div>
					)}
				</div>
				<CardContent className="p-4 space-y-2">
					<h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
						{novel.title}
					</h3>
					<p className="text-sm text-muted-foreground">
						by {novel.author.name}
					</p>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{novel.description}
					</p>
					<div className="flex flex-wrap gap-1">
						{novel.tags.slice(0, 3).map(({ tag }) => (
							<Badge key={tag.slug} variant="secondary" className="text-xs">
								{tag.name}
							</Badge>
						))}
					</div>
					<div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
						<span className="flex items-center gap-1">
							<Eye className="h-4 w-4" />
							{formatNumber(novel.views)}
						</span>
						<span className="flex items-center gap-1">
							<BookOpen className="h-4 w-4" />
							{novel._count.chapters} chapters
						</span>
					</div>
					<p className="text-xs text-muted-foreground">
						Updated {timeAgo(novel.updatedAt)}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
