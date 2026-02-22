import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChapterList } from "@/components/novels/chapter-list";
import { AddToLibraryButton } from "@/components/novels/add-to-library-button";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { formatNumber, formatDate } from "@/lib/utils";
import { BookOpen, PlayCircle, Star } from "lucide-react";

interface NovelPageProps {
	params: Promise<{ slug: string }>;
}

async function getNovel(slug: string) {
	const novel = await prisma.novel.findUnique({
		where: { slug, isVisible: true },
		include: {
			author: {
				select: { id: true, name: true, image: true },
			},
			tags: {
				include: {
					tag: true,
				},
			},
			chapters: {
				where: { isPublished: true },
				orderBy: { chapterNumber: "asc" },
				select: {
					id: true,
					title: true,
					chapterNumber: true,
					isPublished: true,
					views: true,
					createdAt: true,
				},
			},
			reviews: {
				select: { rating: true },
			},
			_count: {
				select: { chapters: true, reviews: true },
			},
		},
	});

	if (!novel) return null;

	const averageRating =
		novel.reviews.length > 0
			? novel.reviews.reduce((sum, r) => sum + r.rating, 0) /
			  novel.reviews.length
			: 0;

	return { ...novel, averageRating };
}

async function getLibraryStatus(novelId: string, userId?: string) {
	if (!userId) return false;

	const entry = await prisma.libraryEntry.findUnique({
		where: {
			userId_novelId: {
				userId,
				novelId,
			},
		},
	});

	return !!entry;
}

export async function generateMetadata({ params }: NovelPageProps) {
	const { slug } = await params;
	const novel = await getNovel(slug);

	if (!novel) {
		return { title: "Novel Not Found" };
	}

	return {
		title: `${novel.title} - TaleForge`,
		description: novel.description,
	};
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
	return (
		<span className="inline-flex items-center gap-0.5">
			{Array.from({ length: max }).map((_, i) => (
				<Star
					key={i}
					className={`h-3.5 w-3.5 ${
						i < Math.round(rating)
							? "forge-star-filled"
							: "forge-star-empty"
					}`}
				/>
			))}
		</span>
	);
}

export default async function NovelPage({ params }: NovelPageProps) {
	const { slug } = await params;
	const [novel, session] = await Promise.all([
		getNovel(slug),
		getServerSession(),
	]);

	if (!novel) {
		notFound();
	}

	const isInLibrary = await getLibraryStatus(novel.id, session?.user?.id);
	const firstChapter = novel.chapters[0];

	const statusClass: Record<string, string> = {
		ONGOING: "forge-status-ongoing",
		COMPLETED: "forge-status-completed",
		HIATUS: "forge-status-hiatus",
	};

	const infoRows = [
		{ label: "Author", value: novel.author.name },
		{ label: "Status", value: novel.status.charAt(0) + novel.status.slice(1).toLowerCase() },
		{ label: "Chapters", value: novel.chapters.length.toString() },
		{ label: "Views", value: formatNumber(novel.views) },
		{ label: "Published", value: formatDate(novel.createdAt) },
		{ label: "Updated", value: formatDate(novel.updatedAt) },
	];

	return (
		<div className="forge-content-container forge-section">
			{/* Breadcrumb */}
			<Breadcrumb className="mb-8">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/novels">Novels</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="max-w-50 truncate">
							{novel.title}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* 2-column layout */}
			<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
				{/* Left column — Cover and info */}
				<div className="lg:sticky lg:top-20 lg:self-start space-y-4">
					{/* Cover image */}
					<div className="forge-card overflow-hidden aspect-[3/4] mb-4">
						{novel.coverImageUrl ? (
							<Image
								src={novel.coverImageUrl}
								alt={novel.title}
								fill
								className="object-cover w-full h-full"
								priority
								sizes="(max-width: 1024px) 100vw, 280px"
							/>
						) : (
							<div className="forge-cover-placeholder w-full h-full flex items-center justify-center">
								<BookOpen className="h-16 w-16 text-forge-gold opacity-50" />
							</div>
						)}
					</div>

					{/* CTA buttons */}
					<div className="flex flex-col gap-3">
						{firstChapter && (
							<Link
								href={`/novels/${novel.slug}/chapter/1`}
								className="forge-btn-primary forge-focus-ring w-full py-3 rounded-lg text-sm inline-flex items-center justify-center transition-colors duration-[var(--duration-fast)]"
							>
								<PlayCircle className="mr-2 h-5 w-5" />
								Start Reading
							</Link>
						)}

						<AddToLibraryButton
							novelId={novel.id}
							isInLibrary={isInLibrary}
							isLoggedIn={!!session}
						/>
					</div>

					{/* Info card */}
					<div className="forge-card-static p-5 mt-4">
						{/* Rating row */}
						{novel._count.reviews > 0 && (
							<div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
								<span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
									Rating
								</span>
								<span className="flex items-center gap-2">
									<StarRating rating={novel.averageRating} />
									<span className="font-sans text-sm font-medium">
										{novel.averageRating.toFixed(1)}
									</span>
									<span className="font-mono text-[0.65rem] text-muted-foreground">
										({novel._count.reviews})
									</span>
								</span>
							</div>
						)}

						{/* Info rows */}
						{infoRows.map((row, i) => (
							<div
								key={row.label}
								className={`flex justify-between items-center py-2 ${
									i < infoRows.length - 1
										? "border-b border-[var(--border)]"
										: ""
								}`}
							>
								<span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
									{row.label}
								</span>
								<span className="font-sans text-sm font-medium">
									{row.value}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Right column — Details, chapters, reviews */}
				<div>
					{/* Title */}
					<h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-2">
						{novel.title}
					</h1>

					{/* Status badge */}
					<span
						className={`${
							statusClass[novel.status as keyof typeof statusClass] ??
							"forge-status-ongoing"
						} px-3 py-1 inline-block mb-3`}
					>
						{novel.status.charAt(0) + novel.status.slice(1).toLowerCase()}
					</span>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 mb-6">
						{novel.tags.map(({ tag }) => (
							<Link
								key={tag.slug}
								href={`/novels?tag=${tag.slug}`}
								className="forge-badge-genre cursor-pointer hover:opacity-80 forge-focus-ring transition-colors duration-[var(--duration-fast)]"
							>
								{tag.name}
							</Link>
						))}
					</div>

					<div className="forge-divider my-6" aria-hidden="true" />

					{/* Synopsis card */}
					<div className="forge-card-static p-6 mb-6">
						<h2 className="font-mono text-xs uppercase tracking-widest text-forge-gold mb-3">
							Synopsis
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
							{novel.description}
						</p>
					</div>

					{/* Chapters card */}
					<div className="forge-card-static overflow-hidden mb-6">
						<div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
							<h2 className="font-mono text-xs uppercase tracking-widest text-forge-gold">
								Chapters
							</h2>
							<span className="font-mono text-[0.7rem] text-muted-foreground">
								{novel.chapters.length} chapters
							</span>
						</div>
						<div>
							<ChapterList
								chapters={novel.chapters}
								novelSlug={novel.slug}
							/>
						</div>
					</div>

					{/* Reviews */}
					<ReviewsSection
						novelId={novel.id}
						authorId={novel.author.id}
					/>
				</div>
			</div>
		</div>
	);
}