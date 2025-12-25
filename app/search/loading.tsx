import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchLoading() {
	return (
		<div className="container py-8">
			<div className="space-y-8">
				<div>
					<Skeleton className="h-9 w-48 mb-4" />
					<div className="flex gap-2">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-24" />
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{Array.from({ length: 10 }).map((_, i) => (
						<Card key={i} className="overflow-hidden">
							<Skeleton className="aspect-2/3" />
							<CardContent className="p-4 space-y-2">
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
