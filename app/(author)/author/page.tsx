import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	BookOpen,
	Eye,
	FileText,
	TrendingUp,
	PlusCircle,
	ArrowRight,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

async function getAuthorStats(authorId: string) {
	const [novels, totalViews, totalChapters, recentNovels] = await Promise.all([
		prisma.novel.count({ where: { authorId } }),
		prisma.novel.aggregate({
			where: { authorId },
			_sum: { views: true },
		}),
		prisma.chapter.count({
			where: { novel: { authorId } },
		}),
		prisma.novel.findMany({
			where: { authorId },
			include: {
				_count: { select: { chapters: true } },
			},
			orderBy: { updatedAt: "desc" },
			take: 5,
		}),
	]);

	return {
		novelCount: novels,
		totalViews: totalViews._sum.views || 0,
		totalChapters,
		recentNovels,
	};
}

export default async function AuthorDashboardPage() {
	const session = await getServerSession();

	if (!session) return null;

	const stats = await getAuthorStats(session.user.id);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Author Dashboard</h1>
					<p className="text-muted-foreground mt-1">
						Manage your novels and track your performance
					</p>
				</div>
				<Button asChild>
					<Link href="/author/novels/new">
						<PlusCircle className="mr-2 h-4 w-4" />
						Create Novel
					</Link>
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Novels</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.novelCount}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalViews)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Chapters
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalChapters}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg. Views</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.novelCount > 0
								? formatNumber(Math.round(stats.totalViews / stats.novelCount))
								: 0}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Novels */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Recent Novels</h2>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/author/novels">
							View All
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>

				{stats.recentNovels.length > 0 ? (
					<div className="grid gap-4">
						{stats.recentNovels.map((novel) => (
							<Card key={novel.id}>
								<CardContent className="flex items-center justify-between p-4">
									<div>
										<Link
											href={`/author/novels/${novel.id}`}
											className="font-semibold hover:text-primary"
										>
											{novel.title}
										</Link>
										<div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
											<span>{novel._count.chapters} chapters</span>
											<span>{formatNumber(novel.views)} views</span>
											<span
												className={
													novel.status === "ONGOING"
														? "text-green-500"
														: novel.status === "COMPLETED"
														? "text-blue-500"
														: "text-yellow-500"
												}
											>
												{novel.status}
											</span>
										</div>
									</div>
									<Button variant="outline" size="sm" asChild>
										<Link href={`/author/novels/${novel.id}`}>Manage</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="font-semibold mb-2">No novels yet</h3>
							<p className="text-muted-foreground text-sm mb-4">
								Start writing your first novel today!
							</p>
							<Button asChild>
								<Link href="/author/novels/new">
									<PlusCircle className="mr-2 h-4 w-4" />
									Create Novel
								</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
