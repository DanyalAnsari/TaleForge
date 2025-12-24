"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, BookOpen } from "lucide-react";

export default function NovelDetailError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Novel detail error:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<AlertTriangle className="h-16 w-16 text-destructive mb-6" />
			<h1 className="text-2xl font-bold mb-2">Failed to load novel</h1>
			<p className="text-muted-foreground mb-6 max-w-md">
				We couldn&apos;t load this novel. Please try again.
			</p>
			<div className="flex gap-4">
				<Button onClick={reset} variant="outline">
					<RefreshCw className="mr-2 h-4 w-4" />
					Try Again
				</Button>
				<Button asChild>
					<Link href="/novels">
						<BookOpen className="mr-2 h-4 w-4" />
						Browse Novels
					</Link>
				</Button>
			</div>
		</div>
	);
}
