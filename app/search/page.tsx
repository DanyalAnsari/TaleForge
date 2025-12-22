import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { SearchForm } from "@/components/search/search-form";
import { NovelGrid } from "@/components/novels/novel-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

interface SearchPageProps {
	searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
	title: "Search Novels | WebNovel",
	description:
		"Search for novels by title, author, or tags. Find your next favorite story on WebNovel.",
	openGraph: {
		title: "Search Novels | WebNovel",
		description:
			"Search for novels by title, author, or tags. Find your next favorite story on WebNovel.",
	},
};

async function searchNovels(query: string) {
	if (!query.trim()) return [];

	const novels = await prisma.novel.findMany({
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
			author: {
				select: { name: true },
			},
			tags: {
				include: {
					tag: {
						select: { name: true, slug: true },
					},
				},
			},
			_count: {
				select: { chapters: true },
			},
		},
		orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
		take: 20,
	});

	return novels;
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
	const novels = await searchNovels(query);

	if (!query) {
		return (
			<div className="text-center py-12 text-muted-foreground">
				Enter a search term to find novels
			</div>
		);
	}

	if (novels.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					No results found for &ldquo;{query}&rdquo;
				</p>
				<p className="text-sm text-muted-foreground mt-2">
					Try different keywords or browse our collection
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground">
				Found {novels.length} result{novels.length !== 1 ? "s" : ""} for &ldquo;
				{query}&rdquo;
			</p>
			<NovelGrid novels={novels} />
		</div>
	);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const { q = "" } = await searchParams;

	return (
		<div className="container py-8">
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
