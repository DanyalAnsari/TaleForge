import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { ChapterForm } from "@/components/author/chapter-form";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
		<div className="max-w-3xl space-y-6">
			{/* Breadcrumb */}
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/author">Dashboard</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/author/novels">My Novels</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink
							href={`/author/novels/${chapter.novel.id}`}
							className="max-w-37.5 truncate"
						>
							{chapter.novel.title}
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink
							href={`/author/novels/${chapter.novel.id}/chapters`}
						>
							Chapters
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Chapter {chapter.chapterNumber}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">
						Edit Chapter {chapter.chapterNumber}
					</h1>
					<p className="text-muted-foreground mt-1">{chapter.title}</p>
				</div>
				<Button variant="outline" asChild>
					<Link href={`/author/novels/${id}/chapters/${chapterId}/preview`}>
						<Eye className="mr-2 h-4 w-4" />
						Preview
					</Link>
				</Button>
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
