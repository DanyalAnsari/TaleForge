import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function NovelDetailLoading() {
	return (
		<div className="w-full container mx-auto py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left column */}
				<div className="lg:col-span-1 space-y-4">
					<Skeleton className="aspect-2/3 rounded-lg" />
					<Skeleton className="h-12 w-full rounded-md" />
					<Skeleton className="h-12 w-full rounded-md" />
					<Card>
						<CardContent className="pt-6 space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-center gap-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-32" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Right column */}
				<div className="lg:col-span-2 space-y-6">
					<div>
						<div className="flex items-start justify-between gap-4">
							<Skeleton className="h-9 w-64" />
							<Skeleton className="h-6 w-20 rounded-full" />
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-6 w-16 rounded" />
							))}
						</div>
					</div>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-24" />
						</CardHeader>
						<CardContent className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-24" />
						</CardHeader>
						<Separator />
						<CardContent className="pt-4 space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-center justify-between py-2">
									<div className="flex items-center gap-3">
										<Skeleton className="h-4 w-12" />
										<Skeleton className="h-4 w-48" />
									</div>
									<Skeleton className="h-4 w-24" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
