"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function NovelsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Novels page error:", error);
	}, [error]);

	return (
		<div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
			<AlertTriangle className="h-16 w-16 text-destructive mb-6" />
			<h1 className="text-2xl font-bold mb-2">Failed to load novels</h1>
			<p className="text-muted-foreground mb-6 max-w-md">
				We couldn&apos;t load the novels. Please try again.
			</p>
			<div className="flex gap-4">
				<Button onClick={reset} variant="outline">
					<RefreshCw className="mr-2 h-4 w-4" />
					Try Again
				</Button>
				<Button asChild>
					<Link href="/">
						<Home className="mr-2 h-4 w-4" />
						Go Home
					</Link>
				</Button>
			</div>
		</div>
	);
}
