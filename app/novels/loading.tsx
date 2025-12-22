import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function NovelsLoading() {
	return (
		<div className="container py-8">
			<div className="flex flex-col gap-6">
				{/* Header */}
				<div>
					<Skeleton className="h-9 w-48" />
					<Skeleton className="h-5 w-64 mt-2" />
				</div>

				{/* Filters */}
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-8 w-20 rounded-full" />
					))}
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-6 w-16 rounded" />
					))}
				</div>

				{/* Novel Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{Array.from({ length: 10 }).map((_, i) => (
						<Card key={i} className="overflow-hidden">
							<Skeleton className="aspect-2/3" />
							<CardContent className="p-4 space-y-2">
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-4 w-2/3" />
								<Skeleton className="h-4 w-full" />
								<div className="flex gap-1">
									<Skeleton className="h-5 w-12 rounded" />
									<Skeleton className="h-5 w-12 rounded" />
								</div>
								<div className="flex gap-4 pt-2">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-20" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
