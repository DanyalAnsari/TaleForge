import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Library, BookOpen, Clock, ArrowRight, BookMarked } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

async function getDashboardData(userId: string) {
	const [libraryCount, recentLibrary, continueReading] = await Promise.all([
		// Total library count
		prisma.libraryEntry.count({
			where: { userId },
		}),
		// Recent library additions
		prisma.libraryEntry.findMany({
			where: { userId },
			include: {
				novel: {
					include: {
						author: { select: { name: true } },
						_count: { select: { chapters: true } },
					},
				},
				lastReadChapter: true,
			},
			orderBy: { updatedAt: "desc" },
			take: 5,
		}),
		// Continue reading (novels with progress)
		prisma.libraryEntry.findMany({
			where: {
				userId,
				lastReadChapterId: { not: null },
			},
			include: {
				novel: {
					include: {
						author: { select: { name: true } },
						chapters: {
							where: { isPublished: true },
							orderBy: { chapterNumber: "asc" },
							select: { id: true, chapterNumber: true, title: true },
						},
					},
				},
				lastReadChapter: true,
			},
			orderBy: { updatedAt: "desc" },
			take: 3,
		}),
	]);

	return { libraryCount, recentLibrary, continueReading };
}

export default async function DashboardPage() {
	const session = await getServerSession();

	if (!session) {
		return null;
	}

	const { libraryCount, recentLibrary, continueReading } =
		await getDashboardData(session.user.id);

	return (
		<div className="space-y-8">
			{/* Welcome Header */}
			<div>
				<h1 className="text-3xl font-bold">
					Welcome back, {session.user.name}!
				</h1>
				<p className="text-muted-foreground mt-1">
					Here&apos;s what&apos;s happening with your reading
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Library</CardTitle>
						<Library className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{libraryCount}</div>
						<p className="text-xs text-muted-foreground">novels saved</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">In Progress</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{continueReading.length}</div>
						<p className="text-xs text-muted-foreground">novels reading</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Last Active</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{recentLibrary[0]
								? formatDate(recentLibrary[0].updatedAt)
								: "Never"}
						</div>
						<p className="text-xs text-muted-foreground">reading activity</p>
					</CardContent>
				</Card>
			</div>

			{/* Continue Reading */}
			{continueReading.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold flex items-center gap-2">
							<BookMarked className="h-5 w-5" />
							Continue Reading
						</h2>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/dashboard/library">
								View All
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						{continueReading.map((entry) => {
							const lastChapter = entry.lastReadChapter;
							const nextChapter = entry.novel.chapters.find(
								(ch) =>
									ch.chapterNumber === (lastChapter?.chapterNumber || 0) + 1
							);
							const totalChapters = entry.novel.chapters.length;
							const progress = lastChapter
								? Math.round((lastChapter.chapterNumber / totalChapters) * 100)
								: 0;

							return (
								<Card key={entry.id} className="overflow-hidden">
									<div className="flex gap-4 p-4">
										<div className="relative w-16 h-24 shrink-0">
											{entry.novel.coverImageUrl ? (
												<Image
													src={entry.novel.coverImageUrl}
													alt={entry.novel.title}
													fill
													className="object-cover rounded"
													sizes="64px"
												/>
											) : (
												<div className="w-full h-full bg-muted rounded flex items-center justify-center">
													<BookOpen className="h-6 w-6 text-muted-foreground" />
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold truncate">
												{entry.novel.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{entry.novel.author.name}
											</p>
											<div className="mt-2">
												<div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
													<span>Progress</span>
													<span>{progress}%</span>
												</div>
												<div className="h-1.5 bg-muted rounded-full overflow-hidden">
													<div
														className="h-full bg-primary rounded-full"
														style={{ width: `${progress}%` }}
													/>
												</div>
											</div>
											<Button size="sm" className="mt-3 w-full" asChild>
												<Link
													href={
														nextChapter
															? `/novels/${entry.novel.slug}/chapter/${nextChapter.chapterNumber}`
															: `/novels/${entry.novel.slug}/chapter/${
																	lastChapter?.chapterNumber || 1
															  }`
													}
												>
													{nextChapter ? "Continue" : "Re-read"}
												</Link>
											</Button>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				</div>
			)}

			{/* Recent Library */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						<Library className="h-5 w-5" />
						Recent Library
					</h2>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/dashboard/library">
							View All
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>

				{recentLibrary.length > 0 ? (
					<div className="grid gap-4">
						{recentLibrary.map((entry) => (
							<Card key={entry.id}>
								<div className="flex items-center gap-4 p-4">
									<div className="relative w-12 h-16 shrink-0">
										{entry.novel.coverImageUrl ? (
											<Image
												src={entry.novel.coverImageUrl}
												alt={entry.novel.title}
												fill
												className="object-cover rounded"
												sizes="48px"
											/>
										) : (
											<div className="w-full h-full bg-muted rounded flex items-center justify-center">
												<BookOpen className="h-4 w-4 text-muted-foreground" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<Link
											href={`/novels/${entry.novel.slug}`}
											className="font-semibold hover:text-primary truncate block"
										>
											{entry.novel.title}
										</Link>
										<p className="text-sm text-muted-foreground">
											{entry.novel.author.name}
										</p>
										<div className="flex items-center gap-2 mt-1">
											<Badge variant="secondary" className="text-xs">
												{entry.novel._count.chapters} chapters
											</Badge>
											{entry.lastReadChapter && (
												<span className="text-xs text-muted-foreground">
													Last read: Ch. {entry.lastReadChapter.chapterNumber}
												</span>
											)}
										</div>
									</div>
									<Button variant="outline" size="sm" asChild>
										<Link href={`/novels/${entry.novel.slug}`}>View</Link>
									</Button>
								</div>
							</Card>
						))}
					</div>
				) : (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Library className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="font-semibold mb-2">Your library is empty</h3>
							<p className="text-muted-foreground text-sm mb-4">
								Start adding novels to your library to track your reading
							</p>
							<Button asChild>
								<Link href="/novels">Browse Novels</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
