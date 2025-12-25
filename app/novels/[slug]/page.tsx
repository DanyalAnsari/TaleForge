import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChapterList } from "@/components/novels/chapter-list";
import { AddToLibraryButton } from "@/components/novels/add-to-library-button";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { formatNumber, formatDate } from "@/lib/utils";
import {
	BookOpen,
	Eye,
	Calendar,
	User,
	Clock,
	PlayCircle,
	Star,
} from "lucide-react";

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
			reviews: {
				select: { rating: true },
			},
			_count: {
				select: { chapters: true, reviews: true },
			},
		},
	});

	if (!novel) return null;

	const averageRating =
		novel.reviews.length > 0
			? novel.reviews.reduce((sum, r) => sum + r.rating, 0) /
			  novel.reviews.length
			: 0;

	return { ...novel, averageRating };
}

async function getLibraryStatus(novelId: string, userId?: string) {
	if (!userId) return false;

	const entry = await prisma.libraryEntry.findUnique({
		where: {
			userId_novelId: {
				userId,
				novelId,
			},
		},
	});

	return !!entry;
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
	const [novel, session] = await Promise.all([
		getNovel(slug),
		getServerSession(),
	]);

	if (!novel) {
		notFound();
	}

	const isInLibrary = await getLibraryStatus(novel.id, session?.user?.id);
	const firstChapter = novel.chapters[0];
	const statusColors = {
		ONGOING: "bg-green-500/10 text-green-500 border-green-500/20",
		COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		HIATUS: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	};

	return (
		<div className="w-full container py-8 mx-auto">
			{/* Breadcrumb */}
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/novels">Novels</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="max-w-50 truncate">
							{novel.title}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left column - Cover and info */}
				<div className="lg:col-span-1 space-y-4">
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

					<AddToLibraryButton
						novelId={novel.id}
						isInLibrary={isInLibrary}
						isLoggedIn={!!session}
					/>

					<Card>
						<CardContent className="pt-6 space-y-4">
							{novel._count.reviews > 0 && (
								<div className="flex items-center gap-2">
									<Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
									<span className="font-medium">
										{novel.averageRating.toFixed(1)}
									</span>
									<span className="text-sm text-muted-foreground">
										({novel._count.reviews} reviews)
									</span>
								</div>
							)}
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

				{/* Right column - Details, chapters, and reviews */}
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

					<ReviewsSection novelId={novel.id} authorId={novel.author.id} />
				</div>
			</div>
		</div>
	);
}
