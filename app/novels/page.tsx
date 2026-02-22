import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { NovelGrid } from "@/components/novels/novel-grid";
import { PaginationNav } from "@/components/ui/pagination-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { NovelStatus } from "@/prisma/generated/prisma/enums";
import Link from "next/link";
import { Metadata } from "next";
import { getServerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "Browse Novels | TaleForge",
	description:
		"Explore our collection of web novels. Filter by genre, status, and tags to find your perfect read.",
	openGraph: {
		title: "Browse Novels | TaleForge",
		description:
			"Explore our collection of web novels. Filter by genre, status, and tags to find your perfect read.",
	},
};

const NOVELS_PER_PAGE = 10;

interface NovelsPageProps {
	searchParams: Promise<{ page?: string; status?: string; tag?: string }>;
}

async function getUserLibraryIds(userId?: string): Promise<string[]> {
	if (!userId) return [];

	const entries = await prisma.libraryEntry.findMany({
		where: { userId },
		select: { novelId: true },
	});

	return entries.map((e) => e.novelId);
}

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
					<Skeleton className="aspect-[3/4] rounded-lg" />
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

	const session = await getServerSession();

	const [{ novels, totalPages, total }, tags, libraryNovelIds] =
		await Promise.all([
			getNovels(page, status, tag),
			getTags(),
			getUserLibraryIds(session?.user?.id),
		]);

	return (
		<div className="forge-content-container forge-section">
			{/* Page header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold mb-1">
					Browse Novels
				</h1>
				<span className="forge-divider w-24 my-3" aria-hidden="true" />
				<p className="font-mono text-xs text-muted-foreground tracking-wide">
					Discover {total.toLocaleString()} stories from our community
				</p>
			</div>

			{/* Status filter pills */}
			<div className="flex gap-2 flex-wrap mb-4">
				<Link
					href="/novels"
					className={`font-mono text-xs uppercase tracking-wider rounded-full px-4 py-1 transition-colors duration-[var(--duration-fast)] forge-focus-ring ${
						!status && !tag
							? "bg-[var(--forge-gold)] text-[oklch(0.10_0.02_260)] font-semibold"
							: "text-muted-foreground hover:text-foreground border border-[var(--border)]"
					}`}
				>
					All
				</Link>
				{["ONGOING", "COMPLETED", "HIATUS"].map((s) => (
					<Link
						key={s}
						href={`/novels?status=${s}`}
						className={`font-mono text-xs uppercase tracking-wider rounded-full px-4 py-1 transition-colors duration-[var(--duration-fast)] forge-focus-ring ${
							status === s
								? "bg-[var(--forge-gold)] text-[oklch(0.10_0.02_260)] font-semibold"
								: "text-muted-foreground hover:text-foreground border border-[var(--border)]"
						}`}
					>
						{s.charAt(0) + s.slice(1).toLowerCase()}
					</Link>
				))}
			</div>

			{/* Tag filter row */}
			<div className="flex flex-wrap gap-2 mb-8">
				{tags.map((t) => (
					<Link
						key={t.slug}
						href={`/novels?tag=${t.slug}`}
						className={`forge-badge-genre cursor-pointer transition-colors duration-[var(--duration-fast)] forge-focus-ring ${
							tag === t.slug
								? "bg-[oklch(from_var(--forge-gold)_l_c_h_/_20%)] border-[var(--forge-gold)]"
								: ""
						}`}
					>
						{t.name}
					</Link>
				))}
			</div>

			{/* Separator */}
			<div className="forge-divider mb-8" aria-hidden="true" />

			{/* Novel grid */}
			<Suspense fallback={<NovelGridSkeleton />}>
				<NovelGrid novels={novels} libraryNovelIds={libraryNovelIds} />
			</Suspense>

			{/* Pagination */}
			<div className="flex justify-center mt-10">
				<PaginationNav
					currentPage={page}
					totalPages={totalPages}
					baseUrl="/novels"
				/>
			</div>
		</div>
	);
}