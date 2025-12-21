// components/search/search-form.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

export function SearchForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [query, setQuery] = useState(searchParams.get("q") || "");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!query.trim()) return;

		startTransition(() => {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		});
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search novels by title, description, or author..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-10"
				/>
			</div>
			<Button type="submit" disabled={isPending}>
				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
			</Button>
		</form>
	);
}
