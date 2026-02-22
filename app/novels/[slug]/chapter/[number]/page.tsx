import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { ReadingProgressTracker } from "@/components/reader/reading-progress-tracker";
import { CommentsSection } from "@/components/comments/comments-section";
import { ChapterReaderShell } from "@/components/reader/chapter-reader-shell";

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
			currentIndex < chapterNumbers.length - 1 ?
				chapterNumbers[currentIndex + 1]
			:	null,
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
		title: `${data.chapter.title} - ${data.novel.title} - TaleForge`,
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
		<>
			{/* Server-side progress tracker */}
			<ReadingProgressTracker
				novelId={novel.id}
				chapterId={chapter.id}
				isLoggedIn={!!session}
			/>

			{/* Client-side reading shell with scroll behaviors */}
			<ChapterReaderShell
				novel={{ id: novel.id, title: novel.title, slug: novel.slug }}
				chapter={{
					id: chapter.id,
					title: chapter.title,
					chapterNumber: chapter.chapterNumber,
					content: chapter.content,
					views: chapter.views,
					createdAt: chapter.createdAt,
				}}
				prevChapter={prevChapter}
				nextChapter={nextChapter}
				totalChapters={totalChapters}
			>
				{/* CommentsSection rendered as a server component, passed as children */}
				<CommentsSection chapterId={chapter.id} />
			</ChapterReaderShell>
		</>
	);
}
