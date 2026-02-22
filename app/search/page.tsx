import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { SearchForm } from "@/components/search/search-form";
import { NovelGrid } from "@/components/novels/novel-grid";
import { Search, BookOpen } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Search Novels | TaleForge",
	description: "Search for novels by title, author, or tags.",
};

interface SearchPageProps {
	searchParams: Promise<{ q?: string }>;
}

async function searchNovels(query: string) {
	if (!query.trim()) return [];

	return prisma.novel.findMany({
		where: {
			isVisible: true,
			OR: [
				{ title: { contains: query, mode: "insensitive" } },
				{ description: { contains: query, mode: "insensitive" } },
				{ author: { name: { contains: query, mode: "insensitive" } } },
				{
					tags: {
						some: {
							tag: { name: { contains: query, mode: "insensitive" } },
						},
					},
				},
			],
		},
		include: {
			author: { select: { name: true } },
			tags: { include: { tag: { select: { name: true, slug: true } } } },
			_count: { select: { chapters: true } },
		},
		orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
		take: 20,
	});
}

async function getUserLibraryIds(userId?: string): Promise<string[]> {
	if (!userId) return [];

	const entries = await prisma.libraryEntry.findMany({
		where: { userId },
		select: { novelId: true },
	});

	return entries.map((e) => e.novelId);
}

function SearchResultsSkeleton() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
			{Array.from({ length: 10 }).map((_, i) => (
				<div key={i} className="space-y-3">
					<div className="forge-skeleton aspect-[3/4] rounded-[var(--radius-xl)]" />
					<div className="forge-skeleton h-4 w-3/4 rounded-[var(--radius-sm)]" />
					<div className="forge-skeleton h-3 w-1/2 rounded-[var(--radius-sm)]" />
				</div>
			))}
		</div>
	);
}

async function SearchResults({ query }: { query: string }) {
	const session = await getServerSession();
	const [novels, libraryNovelIds] = await Promise.all([
		searchNovels(query),
		getUserLibraryIds(session?.user?.id),
	]);

	if (!query) {
		return (
			<div className="forge-empty-state">
				<Search className="forge-empty-state-icon" strokeWidth={1.75} />
				<p className="forge-empty-state-title">Start searching</p>
				<p className="forge-empty-state-description">
					Enter a search term to find novels by title, author, description, or
					tags.
				</p>
			</div>
		);
	}

	if (novels.length === 0) {
		return (
			<div className="forge-empty-state">
				<BookOpen className="forge-empty-state-icon" strokeWidth={1.75} />
				<p className="forge-empty-state-title">No stories found</p>
				<p className="forge-empty-state-description">
					We couldn&apos;t find any novels matching &ldquo;{query}&rdquo;. Try
					different keywords or browse our collection.
				</p>
				<Link
					href="/novels"
					className="forge-btn-ghost forge-focus-ring mt-6 inline-flex items-center px-6 py-2 text-sm transition-colors duration-[var(--duration-fast)]"
				>
					Browse All Novels
				</Link>
			</div>
		);
	}

	return (
		<div>
			<p className="font-mono text-xs text-muted-foreground tracking-wide mb-6">
				Found {novels.length} result{novels.length !== 1 ? "s" : ""} for
				&ldquo;{query}&rdquo;
			</p>
			<NovelGrid novels={novels} libraryNovelIds={libraryNovelIds} />
		</div>
	);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const { q = "" } = await searchParams;

	return (
		<div className="forge-content-container forge-section">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold mb-1">
					Search Novels
				</h1>
				<div className="forge-divider w-24 my-3" aria-hidden="true" />
			</div>

			{/* Search form */}
			<div className="forge-card-static p-5 mb-8">
				<Suspense>
					<SearchForm inputClassName="forge-input w-full px-4 py-2.5 forge-focus-ring" />
				</Suspense>
			</div>

			{/* Results */}
			<Suspense fallback={<SearchResultsSkeleton />}>
				<SearchResults query={q} />
			</Suspense>
		</div>
	);
}