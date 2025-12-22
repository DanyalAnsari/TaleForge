import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { NovelGrid } from "@/components/novels/novel-grid";
import { PaginationNav } from "@/components/ui/pagination-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { NovelStatus } from "@/prisma/generated/prisma/enums";
import Link from "next/link";
import { Metadata } from "next";

const NOVELS_PER_PAGE = 10;

interface NovelsPageProps {
	searchParams: Promise<{ page?: string; status?: string; tag?: string }>;
}

export const metadata: Metadata = {
	title: "Browse Novels | WebNovel",
	description:
		"Explore our collection of web novels. Filter by genre, status, and tags to find your perfect read.",
	openGraph: {
		title: "Browse Novels | WebNovel",
		description:
			"Explore our collection of web novels. Filter by genre, status, and tags to find your perfect read.",
	},
};

async function getNovels(page: number, status?: string, tagSlug?: string) {
	const where = {
		isVisible: true,
		...(status && { status: status as NovelStatus }),
		...(tagSlug && {
			tags: {
				some: {
					tag: {
						slug: tagSlug,
					},
				},
			},
		}),
	};

	const [novels, total] = await Promise.all([
		prisma.novel.findMany({
			where,
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
			orderBy: { updatedAt: "desc" },
			skip: (page - 1) * NOVELS_PER_PAGE,
			take: NOVELS_PER_PAGE,
		}),
		prisma.novel.count({ where }),
	]);

	return {
		novels,
		totalPages: Math.ceil(total / NOVELS_PER_PAGE),
		total,
	};
}

async function getTags() {
	return prisma.tag.findMany({
		orderBy: { name: "asc" },
	});
}

function NovelGridSkeleton() {
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

export default async function NovelsPage({ searchParams }: NovelsPageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const status = params.status;
	const tag = params.tag;

	const [{ novels, totalPages, total }, tags] = await Promise.all([
		getNovels(page, status, tag),
		getTags(),
	]);

	return (
		<div className="container py-8">
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="text-3xl font-bold">Browse Novels</h1>
					<p className="text-muted-foreground mt-1">
						Discover {total} stories from our community
					</p>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap gap-2">
					<Link
						href="/novels"
						className={`px-3 py-1 rounded-full text-sm transition-colors ${
							!status && !tag
								? "bg-primary text-primary-foreground"
								: "bg-muted hover:bg-muted/80"
						}`}
					>
						All
					</Link>
					{["ONGOING", "COMPLETED", "HIATUS"].map((s) => (
						<a
							key={s}
							href={`/novels?status=${s}`}
							className={`px-3 py-1 rounded-full text-sm transition-colors ${
								status === s
									? "bg-primary text-primary-foreground"
									: "bg-muted hover:bg-muted/80"
							}`}
						>
							{s.charAt(0) + s.slice(1).toLowerCase()}
						</a>
					))}
				</div>

				{/* Tags filter */}
				<div className="flex flex-wrap gap-2">
					{tags.map((t) => (
						<a
							key={t.slug}
							href={`/novels?tag=${t.slug}`}
							className={`px-2 py-0.5 rounded text-xs transition-colors ${
								tag === t.slug
									? "bg-primary text-primary-foreground"
									: "bg-muted hover:bg-muted/80"
							}`}
						>
							{t.name}
						</a>
					))}
				</div>

				<Suspense fallback={<NovelGridSkeleton />}>
					<NovelGrid novels={novels} />
				</Suspense>

				<PaginationNav
					currentPage={page}
					totalPages={totalPages}
					baseUrl="/novels"
				/>
			</div>
		</div>
	);
}
