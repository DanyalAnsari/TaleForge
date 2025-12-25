import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ChapterLoading() {
	return (
		<div className="min-h-screen">
			{/* Header */}
			<div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
				<div className="w-full container mx-auto py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-32" />
							<span className="text-muted-foreground">/</span>
							<Skeleton className="h-5 w-16" />
						</div>
						<Skeleton className="h-9 w-9 rounded-md" />
					</div>
				</div>
			</div>

			{/* Content */}
			<article className="container max-w-3xl py-8">
				<header className="text-center mb-8">
					<Skeleton className="h-4 w-24 mx-auto mb-2" />
					<Skeleton className="h-8 w-64 mx-auto mb-4" />
					<div className="flex items-center justify-center gap-4">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-24" />
					</div>
				</header>

				<Separator className="my-8" />

				<div className="space-y-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					))}
				</div>
			</article>
		</div>
	);
}
