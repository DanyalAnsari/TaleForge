import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { ChapterNavigation } from "@/components/reader/chapter-navigation";
import { ReaderSettings } from "@/components/reader/reader-settings";
import { ReadingProgressTracker } from "@/components/reader/reading-progress-tracker";
import { CommentsSection } from "@/components/comments/comments-section";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";

interface ChapterPageProps {
	params: Promise<{ slug: string; number: string }>;
}

async function getChapter(novelSlug: string, chapterNumber: number) {
	const novel = await prisma.novel.findUnique({
		where: { slug: novelSlug, isVisible: true },
		select: {
			id: true,
			title: true,
			slug: true,
			chapters: {
				where: { isPublished: true },
				orderBy: { chapterNumber: "asc" },
				select: { id: true, chapterNumber: true },
			},
		},
	});

	if (!novel) return null;

	const chapter = await prisma.chapter.findFirst({
		where: {
			novelId: novel.id,
			chapterNumber,
			isPublished: true,
		},
	});

	if (!chapter) return null;

	const chapterNumbers = novel.chapters.map((c) => c.chapterNumber);
	const currentIndex = chapterNumbers.indexOf(chapterNumber);

	return {
		novel,
		chapter,
		prevChapter: currentIndex > 0 ? chapterNumbers[currentIndex - 1] : null,
		nextChapter:
			currentIndex < chapterNumbers.length - 1
				? chapterNumbers[currentIndex + 1]
				: null,
		totalChapters: chapterNumbers.length,
	};
}

export async function generateMetadata({ params }: ChapterPageProps) {
	const { slug, number } = await params;
	const data = await getChapter(slug, Number(number));

	if (!data) {
		return { title: "Chapter Not Found" };
	}

	return {
		title: `${data.chapter.title} - ${data.novel.title} - WebNovel`,
		description: `Read Chapter ${data.chapter.chapterNumber}: ${data.chapter.title} of ${data.novel.title}`,
	};
}

export default async function ChapterPage({ params }: ChapterPageProps) {
	const { slug, number } = await params;
	const [data, session] = await Promise.all([
		getChapter(slug, Number(number)),
		getServerSession(),
	]);

	if (!data) {
		notFound();
	}

	const { novel, chapter, prevChapter, nextChapter, totalChapters } = data;

	// Increment view count (fire and forget)
	prisma.chapter
		.update({
			where: { id: chapter.id },
			data: { views: { increment: 1 } },
		})
		.catch(() => {});

	return (
		<div className="min-h-screen">
			{/* Reading Progress Tracker */}
			<ReadingProgressTracker
				novelId={novel.id}
				chapterId={chapter.id}
				isLoggedIn={!!session}
			/>

			{/* Header */}
			<div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
				<div className="container py-3">
					<div className="flex items-center justify-between">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="/novels">Novels</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink
										href={`/novels/${novel.slug}`}
										className="max-w-37.5 truncate"
									>
										{novel.title}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Ch. {chapter.chapterNumber}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<ReaderSettings />
					</div>
				</div>
			</div>

			{/* Content */}
			<article className="container max-w-3xl py-8">
				<header className="text-center mb-8">
					<p className="text-sm text-muted-foreground mb-2">
						Chapter {chapter.chapterNumber}
					</p>
					<h1 className="text-2xl md:text-3xl font-bold mb-4">
						{chapter.title}
					</h1>
					<div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
						<span className="flex items-center gap-1">
							<Eye className="h-4 w-4" />
							{chapter.views.toLocaleString()} views
						</span>
						<span>{formatDate(chapter.createdAt)}</span>
					</div>
				</header>

				<Separator className="my-8" />

				<div id="reader-content" className="reader-content reader-theme-light">
					{chapter.content.split("\n\n").map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<Separator className="my-8" />

				<ChapterNavigation
					novelSlug={novel.slug}
					currentChapter={chapter.chapterNumber}
					totalChapters={totalChapters}
					prevChapter={prevChapter}
					nextChapter={nextChapter}
				/>

				{/* Comments Section */}
				<div className="mt-12">
					<CommentsSection chapterId={chapter.id} />
				</div>
			</article>

			{/* Bottom navigation (mobile friendly) */}
			<div className="sticky bottom-0 bg-background/95 backdrop-blur border-t py-4">
				<div className="container">
					<ChapterNavigation
						novelSlug={novel.slug}
						currentChapter={chapter.chapterNumber}
						totalChapters={totalChapters}
						prevChapter={prevChapter}
						nextChapter={nextChapter}
					/>
				</div>
			</div>
		</div>
	);
}
