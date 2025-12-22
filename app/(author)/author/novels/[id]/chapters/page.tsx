import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChapterActions } from "@/components/author/chapter-actions";
import { PlusCircle, FileText, ArrowLeft } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

interface ChaptersPageProps {
	params: Promise<{ id: string }>;
}

async function getNovelWithChapters(novelId: string, userId: string) {
	const novel = await prisma.novel.findUnique({
		where: { id: novelId },
		include: {
			chapters: {
				orderBy: { chapterNumber: "asc" },
			},
		},
	});

	if (!novel) return null;

	const session = await getServerSession();
	const userRole = (session?.user)?.role;
	if (novel.authorId !== userId && userRole !== "ADMIN") {
		return null;
	}

	return novel;
}

export default async function ChaptersPage({ params }: ChaptersPageProps) {
	const { id } = await params;
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const novel = await getNovelWithChapters(id, session.user.id);

	if (!novel) {
		notFound();
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
						<Link
							href={`/author/novels/${novel.id}`}
							className="hover:text-foreground flex items-center gap-1"
						>
							<ArrowLeft className="h-4 w-4" />
							{novel.title}
						</Link>
					</div>
					<h1 className="text-3xl font-bold">Chapters</h1>
					<p className="text-muted-foreground mt-1">
						{novel.chapters.length} chapter
						{novel.chapters.length !== 1 ? "s" : ""}
					</p>
				</div>
				<Button asChild>
					<Link href={`/author/novels/${novel.id}/chapters/new`}>
						<PlusCircle className="mr-2 h-4 w-4" />
						Add Chapter
					</Link>
				</Button>
			</div>

			{/* Chapter List */}
			{novel.chapters.length > 0 ? (
				<div className="space-y-2">
					{novel.chapters.map((chapter) => (
						<Card key={chapter.id}>
							<CardContent className="flex items-center justify-between p-4">
								<div className="flex items-center gap-4">
									<div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-sm font-medium">
										{chapter.chapterNumber}
									</div>
									<div>
										<Link
											href={`/author/novels/${novel.id}/chapters/${chapter.id}`}
											className="font-semibold hover:text-primary"
										>
											{chapter.title}
										</Link>
										<div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
											<span>{formatNumber(chapter.views)} views</span>
											<span>{formatDate(chapter.updatedAt)}</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant={chapter.isPublished ? "default" : "secondary"}
									>
										{chapter.isPublished ? "Published" : "Draft"}
									</Badge>
									<ChapterActions
										chapterId={chapter.id}
										novelId={novel.id}
										novelSlug={novel.slug}
										chapterNumber={chapter.chapterNumber}
										isPublished={chapter.isPublished}
									/>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<FileText className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">No chapters yet</h2>
						<p className="text-muted-foreground text-center mb-6">
							Start adding chapters to your novel
						</p>
						<Button asChild>
							<Link href={`/author/novels/${novel.id}/chapters/new`}>
								<PlusCircle className="mr-2 h-4 w-4" />
								Add First Chapter
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
