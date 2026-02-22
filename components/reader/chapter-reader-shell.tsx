"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReaderSettings } from "@/components/reader/reader-settings";
import { cn, formatDate } from "@/lib/utils";

interface ChapterReaderShellProps {
	novel: {
		id: string;
		title: string;
		slug: string;
	};
	chapter: {
		id: string;
		title: string;
		chapterNumber: number;
		content: string;
		views: number;
		createdAt: Date;
	};
	prevChapter: number | null;
	nextChapter: number | null;
	totalChapters: number;
	children?: ReactNode;
}

export function ChapterReaderShell({
	novel,
	chapter,
	prevChapter,
	nextChapter,
	totalChapters,
	children,
}: ChapterReaderShellProps) {
	const headerRef = useRef<HTMLDivElement>(null);
	const [progressWidth, setProgressWidth] = useState("0%");

	// Auto-hide header on scroll down, show on scroll up
	useEffect(() => {
		let lastScrollY = window.scrollY;
		let ticking = false;

		function onScroll() {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const currentScrollY = window.scrollY;
					const header = headerRef.current;

					if (header) {
						if (currentScrollY > lastScrollY && currentScrollY > 60) {
							header.classList.add("forge-reader-header--hidden");
						} else {
							header.classList.remove("forge-reader-header--hidden");
						}
					}

					lastScrollY = currentScrollY;
					ticking = false;
				});
				ticking = true;
			}
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Reading progress bar
	useEffect(() => {
		function onScroll() {
			const scrollY = window.scrollY;
			const docHeight = document.documentElement.scrollHeight;
			const winHeight = window.innerHeight;
			const scrollable = docHeight - winHeight;

			if (scrollable > 0) {
				const pct = Math.min((scrollY / scrollable) * 100, 100);
				setProgressWidth(`${pct}%`);
			}
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div className="forge-reading-room min-h-dvh">
			{/* Sticky reader header */}
			<div ref={headerRef} className="forge-reader-header">
				<div className="forge-content-container flex items-center justify-between h-12">
					{/* Left — breadcrumb */}
					<nav className="flex items-center gap-1 text-sm min-w-0">
						<Link
							href={`/novels/${novel.slug}`}
							className="forge-breadcrumb forge-focus-ring flex items-center gap-1.5 truncate max-w-50 lg:max-w-xs transition-colors duration-(--duration-fast)"
						>
							<ChevronLeft className="h-4 w-4 shrink-0" />
							<span className="truncate">{novel.title}</span>
						</Link>
						<span className="forge-breadcrumb-separator" aria-hidden="true" />
						<span className="forge-breadcrumb-current whitespace-nowrap">
							Ch. {chapter.chapterNumber}
						</span>
					</nav>

					{/* Right — settings */}
					<ReaderSettings />
				</div>
			</div>

			{/* Chapter content area */}
			<article className="forge-prose-container py-(--space-10)">
				<header className="text-center">
					<p className="font-mono text-xs uppercase tracking-widest text-forge-gold mb-2">
						Chapter {chapter.chapterNumber}
					</p>
					<h1 className="font-serif text-2xl lg:text-3xl font-bold mb-4">
						{chapter.title}
					</h1>
					<div className="font-mono text-xs text-muted-foreground flex items-center justify-center gap-4 mb-8">
						<span>{chapter.views.toLocaleString()} views</span>
						<span>{formatDate(chapter.createdAt)}</span>
					</div>
				</header>

				<hr className="forge-divider my-8" aria-hidden="true" />

				{/* Chapter text */}
				<div
					id="reader-content"
					className={cn(
						"prose prose-lg dark:prose-invert max-w-none",
						// Novel-friendly reading styles
						"prose-p:leading-relaxed prose-p:my-4",
						"prose-headings:mt-8 prose-headings:mb-4",
						"prose-blockquote:border-l-primary/50 prose-blockquote:italic",
						"reader-content reader-theme-light dark:reader-theme-dark",
					)}
					dangerouslySetInnerHTML={{ __html: chapter.content }}
				/>

				<hr className="forge-divider my-10" aria-hidden="true" />

				{/* Server-rendered children (CommentsSection) */}
				{children}
			</article>

			{/* Chapter navigation */}
			<div className="forge-chapter-nav">
				<div className="forge-content-container flex items-center justify-between py-4">
					{prevChapter !== null ?
						<Link
							href={`/novels/${novel.slug}/chapter/${prevChapter}`}
							className="forge-btn-ghost forge-focus-ring flex items-center gap-2 text-sm transition-colors duration-(--duration-fast)"
						>
							<ChevronLeft className="h-4 w-4" />
							Chapter {prevChapter}
						</Link>
					:	<span />}

					<span className="font-mono text-[0.7rem] text-muted-foreground">
						{chapter.chapterNumber} / {totalChapters}
					</span>

					{nextChapter !== null ?
						<Link
							href={`/novels/${novel.slug}/chapter/${nextChapter}`}
							className="forge-btn-primary forge-focus-ring flex items-center gap-2 text-sm transition-colors duration-(--duration-fast)"
						>
							Chapter {nextChapter}
							<ChevronRight className="h-4 w-4" />
						</Link>
					:	<span />}
				</div>
			</div>

			{/* Reading progress bar */}
			<div className="forge-reader-progress-bar">
				<div
					className="forge-reader-progress-fill forge-progress"
					style={{ width: progressWidth }}
				/>
			</div>
		</div>
	);
}
