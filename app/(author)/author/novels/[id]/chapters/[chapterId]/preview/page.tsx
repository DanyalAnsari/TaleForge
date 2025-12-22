import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, AlertTriangle, Eye } from "lucide-react";

interface PreviewPageProps {
	params: Promise<{ id: string; chapterId: string }>;
}

async function getChapter(chapterId: string, userId: string) {
	const chapter = await prisma.chapter.findUnique({
		where: { id: chapterId },
		include: {
			novel: {
				select: { id: true, title: true, slug: true, authorId: true },
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

export default async function ChapterPreviewPage({ params }: PreviewPageProps) {
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
		<div className="min-h-screen">
			{/* Preview Banner */}
			<div className="sticky top-16 z-40 bg-yellow-500/10 border-b border-yellow-500/20">
				<div className="container py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-yellow-700">
							<Eye className="h-4 w-4" />
							<span className="text-sm font-medium">
								Preview Mode
								{!chapter.isPublished && " — This chapter is not published"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" asChild>
								<Link href={`/author/novels/${id}/chapters/${chapterId}`}>
									<Edit className="mr-2 h-4 w-4" />
									Back to Edit
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Unpublished Warning */}
			{!chapter.isPublished && (
				<div className="container max-w-3xl pt-4">
					<Alert className="border-yellow-500/50 bg-yellow-500/10">
						<AlertTriangle className="h-4 w-4 text-yellow-600" />
						<AlertDescription className="text-yellow-700">
							This chapter is currently a draft. Readers cannot see it until you
							publish it.
						</AlertDescription>
					</Alert>
				</div>
			)}

			{/* Chapter Content */}
			<article className="container max-w-3xl py-8">
				<div className="mb-4">
					<Link
						href={`/author/novels/${id}/chapters`}
						className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Chapters
					</Link>
				</div>

				<header className="text-center mb-8">
					<p className="text-sm text-muted-foreground mb-2">
						Chapter {chapter.chapterNumber}
					</p>
					<h1 className="text-2xl md:text-3xl font-bold mb-4">
						{chapter.title}
					</h1>
					<p className="text-sm text-muted-foreground">
						{formatDate(chapter.createdAt)}
					</p>
				</header>

				<Separator className="my-8" />

				<div className="reader-content reader-theme-light">
					{chapter.content.split("\n\n").map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<Separator className="my-8" />

				<div className="flex justify-center">
					<Button asChild>
						<Link href={`/author/novels/${id}/chapters/${chapterId}`}>
							<Edit className="mr-2 h-4 w-4" />
							Edit Chapter
						</Link>
					</Button>
				</div>
			</article>
		</div>
	);
}
