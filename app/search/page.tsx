import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { SearchForm } from "@/components/search/search-form";
import { NovelGrid } from "@/components/novels/novel-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Search Novels | WebNovel",
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
					<Skeleton className="aspect-2/3 rounded-lg" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
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
			<EmptyState
				icon={Search}
				title="Start searching"
				description="Enter a search term to find novels by title, author, description, or tags."
			/>
		);
	}

	if (novels.length === 0) {
		return (
			<EmptyState
				icon={BookOpen}
				title="No results found"
				description={`We couldn't find any novels matching "${query}". Try different keywords or browse our collection.`}
				action={{
					label: "Browse All Novels",
					href: "/novels",
				}}
			/>
		);
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground">
				Found {novels.length} result{novels.length !== 1 ? "s" : ""} for &ldquo;
				{query}&rdquo;
			</p>
			<NovelGrid novels={novels} libraryNovelIds={libraryNovelIds} />
		</div>
	);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const { q = "" } = await searchParams;

	return (
		<div className="py-8">
			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold mb-4">Search Novels</h1>
					<Suspense>
						<SearchForm />
					</Suspense>
				</div>

				<Suspense fallback={<SearchResultsSkeleton />}>
					<SearchResults query={q} />
				</Suspense>
			</div>
		</div>
	);
}
