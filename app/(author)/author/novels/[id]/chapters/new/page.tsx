import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { ChapterForm } from "@/components/author/chapter-form";
import { ArrowLeft } from "lucide-react";

interface NewChapterPageProps {
	params: Promise<{ id: string }>;
}

async function getNovel(novelId: string, userId: string) {
	const novel = await prisma.novel.findUnique({
		where: { id: novelId },
		select: { id: true, title: true, authorId: true },
	});

	if (!novel) return null;

	const session = await getServerSession();
	const userRole = (session?.user)?.role;
	if (novel.authorId !== userId && userRole !== "ADMIN") {
		return null;
	}

	return novel;
}

export default async function NewChapterPage({ params }: NewChapterPageProps) {
	const { id } = await params;
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const novel = await getNovel(id, session.user.id);

	if (!novel) {
		notFound();
	}

	return (
		<div className="max-w-3xl">
			<div className="mb-6">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
					<Link
						href={`/author/novels/${novel.id}/chapters`}
						className="hover:text-foreground flex items-center gap-1"
					>
						<ArrowLeft className="h-4 w-4" />
						{novel.title} / Chapters
					</Link>
				</div>
				<h1 className="text-3xl font-bold">Add New Chapter</h1>
			</div>

			<ChapterForm novelId={novel.id} />
		</div>
	);
}
