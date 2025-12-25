import Link from "next/link";
import prisma from "@/lib/prisma";
import { NovelGrid } from "@/components/novels/novel-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, PenTool, Users, TrendingUp } from "lucide-react";
import { getServerSession } from "@/lib/auth-server";

async function getLatestNovels() {
	return await prisma.novel.findMany({
		where: { isVisible: true },
		include: {
			author: { select: { name: true } },
			tags: { include: { tag: { select: { name: true, slug: true } } } },
			_count: { select: { chapters: true } },
		},
		orderBy: { updatedAt: "desc" },
		take: 10,
	});
}

async function getPopularNovels() {
	return prisma.novel.findMany({
		where: { isVisible: true },
		include: {
			author: { select: { name: true } },
			tags: { include: { tag: { select: { name: true, slug: true } } } },
			_count: { select: { chapters: true } },
		},
		orderBy: { views: "desc" },
		take: 5,
	});
}

async function getStats() {
	const [novelCount, chapterCount, authorCount] = await Promise.all([
		prisma.novel.count({ where: { isVisible: true } }),
		prisma.chapter.count({ where: { isPublished: true } }),
		prisma.user.count({ where: { role: "AUTHOR" } }),
	]);

	return { novelCount, chapterCount, authorCount };
}

async function getUserLibraryIds(userId?: string): Promise<string[]> {
	if (!userId) return [];

	const entries = await prisma.libraryEntry.findMany({
		where: { userId },
		select: { novelId: true },
	});

	return entries.map((e) => e.novelId);
}

export default async function HomePage() {
	const session = await getServerSession();
	const [latestNovels, popularNovels, stats, libraryNovelIds] =
		await Promise.all([
			getLatestNovels(),
			getPopularNovels(),
			getStats(),
			getUserLibraryIds(session?.user?.id),
		]);

	return (
		<div className="w-full flex flex-col">
			{/* Hero Section */}
			<section className="py-20 px-4 bg-linear-to-b from-primary/5 to-background">
				<div className="text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Discover Your Next
						<span className="text-primary"> Adventure</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Explore thousands of web novels, from fantasy epics to slice-of-life
						stories. Read, write, and connect with a community of storytellers.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button size="lg" asChild>
							<Link href="/novels">
								<BookOpen className="mr-2 h-5 w-5" />
								Start Reading
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/dashboard/settings">
								<PenTool className="mr-2 h-5 w-5" />
								Become an Author
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-12 border-y bg-muted/30">
				<div className="grid grid-cols-3 gap-8 text-center">
					<div>
						<p className="text-3xl md:text-4xl font-bold text-primary">
							{stats.novelCount.toLocaleString()}
						</p>
						<p className="text-sm md:text-base text-muted-foreground mt-1">
							Novels
						</p>
					</div>
					<div>
						<p className="text-3xl md:text-4xl font-bold text-primary">
							{stats.chapterCount.toLocaleString()}
						</p>
						<p className="text-sm md:text-base text-muted-foreground mt-1">
							Chapters
						</p>
					</div>
					<div>
						<p className="text-3xl md:text-4xl font-bold text-primary">
							{stats.authorCount.toLocaleString()}
						</p>
						<p className="text-sm md:text-base text-muted-foreground mt-1">
							Authors
						</p>
					</div>
				</div>
			</section>

			{/* Popular Novels Section */}
			<section className="w-full py-16 px-4">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<TrendingUp className="h-6 w-6 text-primary" />
						<h2 className="text-2xl md:text-3xl font-bold">Popular Novels</h2>
					</div>
					<Button variant="ghost" asChild>
						<Link href="/novels?sort=popular">
							View All
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
				<NovelGrid novels={popularNovels} libraryNovelIds={libraryNovelIds} />
			</section>

			{/* Latest Updates Section */}
			<section className="py-16 px-4 bg-muted/30">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<BookOpen className="h-6 w-6 text-primary" />
						<h2 className="text-2xl md:text-3xl font-bold">Latest Updates</h2>
					</div>
					<Button variant="ghost" asChild>
						<Link href="/novels">
							View All
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
				<NovelGrid novels={latestNovels} libraryNovelIds={libraryNovelIds} />
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4">
				<div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
					<Users className="h-12 w-12 text-primary mx-auto mb-6" />
					<h2 className="text-2xl md:text-3xl font-bold mb-4">
						Join Our Community
					</h2>
					<p className="text-muted-foreground mb-8 max-w-xl mx-auto">
						Create an account to save your reading progress, build your library,
						leave reviews, and even publish your own stories.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button size="lg" asChild>
							<Link href="/register">Create Free Account</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/login">Sign In</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
