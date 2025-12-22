import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { ChapterForm } from "@/components/author/chapter-form";
import { ArrowLeft } from "lucide-react";

interface EditChapterPageProps {
	params: Promise<{ id: string; chapterId: string }>;
}

async function getChapter(chapterId: string, userId: string) {
	const chapter = await prisma.chapter.findUnique({
		where: { id: chapterId },
		include: {
			novel: {
				select: { id: true, title: true, authorId: true },
			},
		},
	});

	if (!chapter) return null;

	const session = await getServerSession();
	const userRole = session?.user?.role;
	if (chapter.novel.authorId !== userId && userRole !== "ADMIN") {
		return null;
	}

	return chapter;
}

export default async function EditChapterPage({
	params,
}: EditChapterPageProps) {
	const { id, chapterId } = await params;
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const chapter = await getChapter(chapterId, session.user.id);

	if (!chapter || chapter.novel.id !== id) {
		notFound();
	}

	return (
		<div className="max-w-3xl">
			<div className="mb-6">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
					<Link
						href={`/author/novels/${chapter.novel.id}/chapters`}
						className="hover:text-foreground flex items-center gap-1"
					>
						<ArrowLeft className="h-4 w-4" />
						{chapter.novel.title} / Chapters
					</Link>
				</div>
				<h1 className="text-3xl font-bold">
					Edit Chapter {chapter.chapterNumber}
				</h1>
			</div>

			<ChapterForm
				novelId={chapter.novel.id}
				chapter={{
					id: chapter.id,
					title: chapter.title,
					content: chapter.content,
					chapterNumber: chapter.chapterNumber,
					isPublished: chapter.isPublished,
				}}
			/>
		</div>
	);
}
