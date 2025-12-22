import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	BookOpen,
	PlusCircle,
	MoreVertical,
	Edit,
	FileText,
	Eye,
	Trash2,
	ExternalLink,
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";

async function getAuthorNovels(authorId: string) {
	return prisma.novel.findMany({
		where: { authorId },
		include: {
			_count: {
				select: { chapters: true },
			},
			chapters: {
				orderBy: { chapterNumber: "desc" },
				take: 1,
				select: { updatedAt: true },
			},
		},
		orderBy: { updatedAt: "desc" },
	});
}

export default async function AuthorNovelsPage() {
	const session = await getServerSession();

	if (!session) return null;

	const novels = await getAuthorNovels(session.user.id);

	const statusColors = {
		ONGOING: "bg-green-500/10 text-green-500 border-green-500/20",
		COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		HIATUS: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">My Novels</h1>
					<p className="text-muted-foreground mt-1">
						{novels.length} novel{novels.length !== 1 ? "s" : ""} published
					</p>
				</div>
				<Button asChild>
					<Link href="/author/novels/new">
						<PlusCircle className="mr-2 h-4 w-4" />
						Create Novel
					</Link>
				</Button>
			</div>

			{/* Novels List */}
			{novels.length > 0 ? (
				<div className="grid gap-4">
					{novels.map((novel) => (
						<Card key={novel.id} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="flex flex-col sm:flex-row">
									{/* Cover Image */}
									<div className="relative w-full sm:w-32 h-48 sm:h-auto shrink-0">
										{novel.coverImageUrl ? (
											<Image
												src={novel.coverImageUrl}
												alt={novel.title}
												fill
												className="object-cover"
												sizes="(max-width: 640px) 100vw, 128px"
											/>
										) : (
											<div className="w-full h-full min-h-32 bg-muted flex items-center justify-center">
												<BookOpen className="h-8 w-8 text-muted-foreground" />
											</div>
										)}
									</div>

									{/* Novel Info */}
									<div className="flex-1 p-4 sm:p-6">
										<div className="flex items-start justify-between gap-4">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<Link
														href={`/author/novels/${novel.id}`}
														className="text-lg font-semibold hover:text-primary"
													>
														{novel.title}
													</Link>
													<Badge
														variant="outline"
														className={
															statusColors[
																novel.status as keyof typeof statusColors
															]
														}
													>
														{novel.status}
													</Badge>
													{!novel.isVisible && (
														<Badge variant="secondary">Hidden</Badge>
													)}
												</div>
												<p className="text-sm text-muted-foreground line-clamp-2">
													{novel.description}
												</p>
											</div>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link href={`/author/novels/${novel.id}`}>
															<Edit className="mr-2 h-4 w-4" />
															Edit Novel
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link href={`/author/novels/${novel.id}/chapters`}>
															<FileText className="mr-2 h-4 w-4" />
															Manage Chapters
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem asChild>
														<Link
															href={`/novels/${novel.slug}`}
															target="_blank"
														>
															<ExternalLink className="mr-2 h-4 w-4" />
															View Public Page
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-destructive">
														<Trash2 className="mr-2 h-4 w-4" />
														Delete Novel
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>

										{/* Stats */}
										<div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
											<span className="flex items-center gap-1">
												<FileText className="h-4 w-4" />
												{novel._count.chapters} chapters
											</span>
											<span className="flex items-center gap-1">
												<Eye className="h-4 w-4" />
												{formatNumber(novel.views)} views
											</span>
											<span>Updated {formatDate(novel.updatedAt)}</span>
										</div>

										{/* Actions */}
										<div className="flex flex-wrap gap-2 mt-4">
											<Button size="sm" asChild>
												<Link href={`/author/novels/${novel.id}/chapters/new`}>
													<PlusCircle className="mr-2 h-4 w-4" />
													Add Chapter
												</Link>
											</Button>
											<Button size="sm" variant="outline" asChild>
												<Link href={`/author/novels/${novel.id}`}>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</Link>
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">No novels yet</h2>
						<p className="text-muted-foreground text-center mb-6 max-w-md">
							Start your writing journey by creating your first novel. Share
							your stories with readers around the world!
						</p>
						<Button asChild>
							<Link href="/author/novels/new">
								<PlusCircle className="mr-2 h-4 w-4" />
								Create Your First Novel
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
