"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationNavProps {
	currentPage: number;
	totalPages: number;
	baseUrl: string;
}

export function PaginationNav({
	currentPage,
	totalPages,
	baseUrl,
}: PaginationNavProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	function goToPage(page: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`${baseUrl}?${params.toString()}`);
	}

	if (totalPages <= 1) return null;

	const pages = [];
	const showEllipsisStart = currentPage > 3;
	const showEllipsisEnd = currentPage < totalPages - 2;

	if (showEllipsisStart) {
		pages.push(1);
		if (currentPage > 4) pages.push("...");
	}

	for (
		let i = Math.max(1, currentPage - 1);
		i <= Math.min(totalPages, currentPage + 1);
		i++
	) {
		if (!pages.includes(i)) pages.push(i);
	}

	if (showEllipsisEnd) {
		if (currentPage < totalPages - 3) pages.push("...");
		if (!pages.includes(totalPages)) pages.push(totalPages);
	}

	return (
		<div className="flex items-center justify-center gap-2 mt-8">
			<Button
				variant="outline"
				size="icon"
				onClick={() => goToPage(currentPage - 1)}
				disabled={currentPage <= 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			{pages.map((page, index) =>
				page === "..." ? (
					<span key={`ellipsis-${index}`} className="px-2">
						...
					</span>
				) : (
					<Button
						key={page}
						variant={currentPage === page ? "default" : "outline"}
						size="icon"
						onClick={() => goToPage(page as number)}
					>
						{page}
					</Button>
				)
			)}

			<Button
				variant="outline"
				size="icon"
				onClick={() => goToPage(currentPage + 1)}
				disabled={currentPage >= totalPages}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
