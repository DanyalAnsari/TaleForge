import Link from "next/link";
import prisma from "@/lib/prisma";
import { NovelGrid } from "@/components/novels/novel-grid";
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
			<section className="forge-section-hero bg-linear-to-br from-forge-parchment via-forge-gold-muted to-forge-parchment-deep dark:from-forge-navy dark:via-forge-navy-mid dark:to-forge-navy">
				<div className="forge-content-container text-center">
					<h1 className="font-serif text-4xl md:text-6xl font-bold text-forge-gradient">
						Discover Your Next Adventure
					</h1>
					<span
						className="forge-divider w-32 mx-auto my-4"
						aria-hidden="true"
					/>
					<p className="font-mono text-sm text-muted-foreground tracking-wide max-w-xl mx-auto">
						Explore thousands of web novels, from fantasy epics to slice-of-life
						stories. Read, write, and connect with a community of storytellers.
					</p>
					<div className="flex flex-wrap justify-center gap-4 mt-8">
						<Link
							href="/novels"
							className="forge-btn-primary forge-focus-ring px-8 py-3 inline-flex items-center gap-2 transition-colors duration-(--duration-fast)"
						>
							<BookOpen className="h-5 w-5" />
							<span>Start Reading</span>
						</Link>
						<Link
							href="/dashboard/settings"
							className="forge-btn-ghost forge-focus-ring px-8 py-3 inline-flex items-center gap-2 transition-colors duration-(--duration-fast)"
						>
							<PenTool className="h-5 w-5" />
							<span>Become an Author</span>
						</Link>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="border-y border-border bg-card forge-section py-6">
				<div className="forge-content-container">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
						<div>
							<p className="font-serif text-3xl font-bold text-forge-gold">
								{stats.novelCount.toLocaleString()}
							</p>
							<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
								Novels
							</p>
						</div>
						<div>
							<p className="font-serif text-3xl font-bold text-forge-gold">
								{stats.chapterCount.toLocaleString()}
							</p>
							<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
								Chapters
							</p>
						</div>
						<div>
							<p className="font-serif text-3xl font-bold text-forge-gold">
								{stats.authorCount.toLocaleString()}
							</p>
							<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
								Authors
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Popular Novels Section */}
			<section className="forge-section">
				<div className="forge-content-container">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<TrendingUp className="h-6 w-6 text-forge-gold" />
							<h2 className="font-serif text-2xl font-semibold">
								Popular Novels
							</h2>
						</div>
						<Link
							href="/novels?sort=popular"
							className="forge-btn-ghost forge-focus-ring text-xs px-4 py-1.5 inline-flex items-center gap-2 transition-colors duration-(--duration-fast)"
						>
							<span>View All</span>
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
					<NovelGrid novels={popularNovels} libraryNovelIds={libraryNovelIds} />
				</div>
			</section>

			{/* Latest Updates Section */}
			<section className="forge-section">
				<div className="forge-content-container">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<BookOpen className="h-6 w-6 text-forge-gold" />
							<h2 className="font-serif text-2xl font-semibold">
								Latest Updates
							</h2>
						</div>
						<Link
							href="/novels"
							className="forge-btn-ghost forge-focus-ring text-xs px-4 py-1.5 inline-flex items-center gap-2 transition-colors duration-(--duration-fast)"
						>
							<span>View All</span>
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
					<NovelGrid novels={latestNovels} libraryNovelIds={libraryNovelIds} />
				</div>
			</section>

			{/* CTA / Join Community Section */}
			<section className="forge-section-lg bg-forge-gold-muted dark:bg-forge-gold-muted">
				<div className="forge-content-container text-center">
					<Users className="h-12 w-12 text-forge-gold mx-auto mb-6" />
					<h2 className="font-serif text-3xl font-bold mb-4">
						Join Our Community
					</h2>
					<span
						className="forge-divider w-24 mx-auto my-4"
						aria-hidden="true"
					/>
					<p className="font-mono text-sm text-muted-foreground tracking-wide max-w-xl mx-auto mb-8">
						Create an account to save your reading progress, build your library,
						leave reviews, and even publish your own stories.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link
							href="/register"
							className="forge-btn-primary forge-focus-ring px-8 py-3 inline-flex items-center justify-center transition-colors duration-(--duration-fast)"
						>
							Create Free Account
						</Link>
						<Link
							href="/login"
							className="forge-btn-ghost forge-focus-ring px-8 py-3 inline-flex items-center justify-center transition-colors duration-(--duration-fast)"
						>
							Sign In
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
