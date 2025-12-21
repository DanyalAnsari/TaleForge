import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChapterList } from "@/components/novels/chapter-list";
import { formatNumber, formatDate } from "@/lib/utils";
import { BookOpen, Eye, Calendar, User, Clock, PlayCircle } from "lucide-react";

interface NovelPageProps {
	params: Promise<{ slug: string }>;
}

async function getNovel(slug: string) {
	const novel = await prisma.novel.findUnique({
		where: { slug, isVisible: true },
		include: {
			author: {
				select: { id: true, name: true, image: true },
			},
			tags: {
				include: {
					tag: true,
				},
			},
			chapters: {
				where: { isPublished: true },
				orderBy: { chapterNumber: "asc" },
				select: {
					id: true,
					title: true,
					chapterNumber: true,
					isPublished: true,
					views: true,
					createdAt: true,
				},
			},
			_count: {
				select: { chapters: true },
			},
		},
	});

	return novel;
}

export async function generateMetadata({ params }: NovelPageProps) {
	const { slug } = await params;
	const novel = await getNovel(slug);

	if (!novel) {
		return { title: "Novel Not Found" };
	}

	return {
		title: `${novel.title} - WebNovel`,
		description: novel.description,
	};
}

export default async function NovelPage({ params }: NovelPageProps) {
	const { slug } = await params;
	const novel = await getNovel(slug);

	if (!novel) {
		notFound();
	}

	const firstChapter = novel.chapters[0];
	const statusColors = {
		ONGOING: "bg-green-500/10 text-green-500 border-green-500/20",
		COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		HIATUS: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	};

	return (
		<div className="container py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left column - Cover and info */}
				<div className="lg:col-span-1 space-y-6">
					<div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-lg">
						{novel.coverImageUrl ? (
							<Image
								src={novel.coverImageUrl}
								alt={novel.title}
								fill
								className="object-cover"
								priority
								sizes="(max-width: 1024px) 100vw, 33vw"
							/>
						) : (
							<div className="w-full h-full bg-muted flex items-center justify-center">
								<BookOpen className="h-20 w-20 text-muted-foreground" />
							</div>
						)}
					</div>

					{firstChapter && (
						<Button asChild className="w-full" size="lg">
							<Link href={`/novels/${novel.slug}/chapter/1`}>
								<PlayCircle className="mr-2 h-5 w-5" />
								Start Reading
							</Link>
						</Button>
					)}

					<Card>
						<CardContent className="pt-6 space-y-4">
							<div className="flex items-center gap-2">
								<User className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									Author:{" "}
									<span className="font-medium">{novel.author.name}</span>
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Eye className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									Views:{" "}
									<span className="font-medium">
										{formatNumber(novel.views)}
									</span>
								</span>
							</div>
							<div className="flex items-center gap-2">
								<BookOpen className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									Chapters:{" "}
									<span className="font-medium">{novel.chapters.length}</span>
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									Published:{" "}
									<span className="font-medium">
										{formatDate(novel.createdAt)}
									</span>
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									Updated:{" "}
									<span className="font-medium">
										{formatDate(novel.updatedAt)}
									</span>
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right column - Details and chapters */}
				<div className="lg:col-span-2 space-y-6">
					<div>
						<div className="flex items-start justify-between gap-4">
							<h1 className="text-3xl font-bold">{novel.title}</h1>
							<Badge
								variant="outline"
								className={
									statusColors[novel.status as keyof typeof statusColors]
								}
							>
								{novel.status}
							</Badge>
						</div>

						<div className="flex flex-wrap gap-2 mt-4">
							{novel.tags.map(({ tag }) => (
								<Link key={tag.slug} href={`/novels?tag=${tag.slug}`}>
									<Badge variant="secondary" className="hover:bg-secondary/80">
										{tag.name}
									</Badge>
								</Link>
							))}
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Synopsis</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground whitespace-pre-line leading-relaxed">
								{novel.description}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Chapters</CardTitle>
							<span className="text-sm text-muted-foreground">
								{novel.chapters.length} chapters
							</span>
						</CardHeader>
						<Separator />
						<CardContent className="pt-4">
							<ChapterList chapters={novel.chapters} novelSlug={novel.slug} />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
