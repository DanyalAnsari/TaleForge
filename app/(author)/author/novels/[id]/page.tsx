import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { NovelForm } from "@/components/author/novel-form";
import { DeleteNovelButton } from "@/components/author/delete-novel-button";
import { VisibilityToggle } from "@/components/author/visibility-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, ExternalLink } from "lucide-react";

interface EditNovelPageProps {
	params: Promise<{ id: string }>;
}

async function getNovel(id: string, userId: string) {
	const novel = await prisma.novel.findUnique({
		where: { id },
		include: {
			tags: {
				include: { tag: true },
			},
			_count: {
				select: { chapters: true },
			},
		},
	});

	if (!novel) return null;

	// Check ownership
	const session = await getServerSession();
	const userRole = session?.user?.role;
	if (novel.authorId !== userId && userRole !== "ADMIN") {
		return null;
	}

	return novel;
}

async function getTags() {
	return prisma.tag.findMany({
		orderBy: { name: "asc" },
	});
}

export default async function EditNovelPage({ params }: EditNovelPageProps) {
	const { id } = await params;
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const [novel, tags] = await Promise.all([
		getNovel(id, session.user.id),
		getTags(),
	]);

	if (!novel) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Edit Novel</h1>
					<p className="text-muted-foreground mt-1">{novel.title}</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" asChild>
						<Link href={`/author/novels/${novel.id}/chapters`}>
							<FileText className="mr-2 h-4 w-4" />
							Manage Chapters ({novel._count.chapters})
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href={`/novels/${novel.slug}`} target="_blank">
							<ExternalLink className="mr-2 h-4 w-4" />
							View
						</Link>
					</Button>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<NovelForm novel={novel} tags={tags} />
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Visibility</CardTitle>
						</CardHeader>
						<CardContent>
							<VisibilityToggle
								novelId={novel.id}
								isVisible={novel.isVisible}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-destructive">Danger Zone</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Deleting a novel is permanent and cannot be undone. All chapters
								will be deleted as well.
							</p>
							<DeleteNovelButton novelId={novel.id} novelTitle={novel.title} />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
