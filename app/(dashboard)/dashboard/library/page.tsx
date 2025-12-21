import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RemoveFromLibraryButton } from "@/components/dashboard/remove-from-library-button";
import { BookOpen, Library } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getLibrary(userId: string) {
	return prisma.libraryEntry.findMany({
		where: { userId },
		include: {
			novel: {
				include: {
					author: { select: { name: true } },
					chapters: {
						where: { isPublished: true },
						orderBy: { chapterNumber: "desc" },
						take: 1,
						select: { chapterNumber: true },
					},
					_count: { select: { chapters: true } },
				},
			},
			lastReadChapter: true,
		},
		orderBy: { updatedAt: "desc" },
	});
}

export default async function LibraryPage() {
	const session = await getServerSession();

	if (!session) {
		return null;
	}

	const library = await getLibrary(session.user.id);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Library</h1>
					<p className="text-muted-foreground mt-1">
						{library.length} novel{library.length !== 1 ? "s" : ""} saved
					</p>
				</div>
				<Button asChild>
					<Link href="/novels">Browse Novels</Link>
				</Button>
			</div>

			{library.length > 0 ? (
				<div className="grid gap-4">
					{library.map((entry) => {
						const latestChapter = entry.novel.chapters[0]?.chapterNumber || 0;
						const lastReadChapter = entry.lastReadChapter?.chapterNumber || 0;
						const hasNewChapters = latestChapter > lastReadChapter;
						const progress =
							latestChapter > 0
								? Math.round((lastReadChapter / latestChapter) * 100)
								: 0;

						return (
							<Card key={entry.id} className="overflow-hidden">
								<div className="flex flex-col sm:flex-row gap-4 p-4">
									{/* Cover Image */}
									<Link
										href={`/novels/${entry.novel.slug}`}
										className="relative w-full sm:w-24 h-40 sm:h-32 shrink-0"
									>
										{entry.novel.coverImageUrl ? (
											<Image
												src={entry.novel.coverImageUrl}
												alt={entry.novel.title}
												fill
												className="object-cover rounded"
												sizes="(max-width: 640px) 100vw, 96px"
											/>
										) : (
											<div className="w-full h-full bg-muted rounded flex items-center justify-center">
												<BookOpen className="h-8 w-8 text-muted-foreground" />
											</div>
										)}
									</Link>

									{/* Novel Info */}
									<div className="flex-1 min-w-0 space-y-2">
										<div className="flex items-start justify-between gap-2">
											<div>
												<Link
													href={`/novels/${entry.novel.slug}`}
													className="font-semibold text-lg hover:text-primary line-clamp-1"
												>
													{entry.novel.title}
												</Link>
												<p className="text-sm text-muted-foreground">
													by {entry.novel.author.name}
												</p>
											</div>
											{hasNewChapters && (
												<Badge variant="default" className="shrink-0">
													New Chapters
												</Badge>
											)}
										</div>

										<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
											<span>{entry.novel._count.chapters} chapters</span>
											<span>•</span>
											<span>Added {formatDate(entry.createdAt)}</span>
										</div>

										{/* Progress Bar */}
										<div>
											<div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
												<span>
													{lastReadChapter > 0
														? `Chapter ${lastReadChapter} of ${latestChapter}`
														: "Not started"}
												</span>
												<span>{progress}%</span>
											</div>
											<div className="h-2 bg-muted rounded-full overflow-hidden">
												<div
													className="h-full bg-primary rounded-full transition-all"
													style={{ width: `${progress}%` }}
												/>
											</div>
										</div>

										{/* Actions */}
										<div className="flex flex-wrap gap-2 pt-2">
											<Button size="sm" asChild>
												<Link
													href={
														lastReadChapter > 0
															? `/novels/${entry.novel.slug}/chapter/${Math.min(
																	lastReadChapter + 1,
																	latestChapter
															  )}`
															: `/novels/${entry.novel.slug}/chapter/1`
													}
												>
													{lastReadChapter > 0
														? "Continue Reading"
														: "Start Reading"}
												</Link>
											</Button>
											<Button size="sm" variant="outline" asChild>
												<Link href={`/novels/${entry.novel.slug}`}>
													View Novel
												</Link>
											</Button>
											<RemoveFromLibraryButton novelId={entry.novel.id} />
										</div>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<Library className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">
							Your library is empty
						</h2>
						<p className="text-muted-foreground text-center mb-6 max-w-md">
							Browse our collection and add novels to your library to keep track
							of what you&apos;re reading.
						</p>
						<Button asChild>
							<Link href="/novels">Browse Novels</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
