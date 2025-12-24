"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<AlertTriangle className="h-16 w-16 text-destructive mb-6" />
			<h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
			<p className="text-muted-foreground mb-6 max-w-md">
				We apologize for the inconvenience. An unexpected error has occurred.
			</p>
			{error.digest && (
				<p className="text-xs text-muted-foreground mb-4">
					Error ID: {error.digest}
				</p>
			)}
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
