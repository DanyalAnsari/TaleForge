import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthorDashboardLoading() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<Skeleton className="h-9 w-48" />
					<Skeleton className="h-5 w-64 mt-2" />
				</div>
				<Skeleton className="h-10 w-32" />
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Recent Novels */}
			<div className="space-y-4">
				<Skeleton className="h-6 w-32" />
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="flex items-center justify-between p-4">
								<div className="space-y-2">
									<Skeleton className="h-5 w-48" />
									<div className="flex gap-4">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-16" />
									</div>
								</div>
								<Skeleton className="h-9 w-20" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
