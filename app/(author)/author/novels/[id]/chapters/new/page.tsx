import { notFound, redirect } from "next/navigation";
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
	const userRole = session?.user?.role;
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
							href={`/author/novels/${novel.id}`}
							className="max-w-37.5 truncate"
						>
							{novel.title}
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`/author/novels/${novel.id}/chapters`}>
							Chapters
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>New Chapter</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div>
				<h1 className="text-3xl font-bold">Add New Chapter</h1>
				<p className="text-muted-foreground mt-1">{novel.title}</p>
			</div>

			<ChapterForm novelId={novel.id} />
		</div>
	);
}
