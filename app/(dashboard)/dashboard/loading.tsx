import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
	return (
		<div className="space-y-8">
			{/* Welcome Header */}
			<div>
				<Skeleton className="h-9 w-64" />
				<Skeleton className="h-5 w-48 mt-2" />
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-3 w-24 mt-1" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Continue Reading */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-8 w-20" />
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="flex gap-4">
									<Skeleton className="w-16 h-24 rounded" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-5 w-full" />
										<Skeleton className="h-4 w-2/3" />
										<Skeleton className="h-2 w-full rounded-full" />
										<Skeleton className="h-8 w-full mt-2" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Recent Library */}
			<div className="space-y-4">
				<Skeleton className="h-6 w-32" />
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="flex items-center gap-4 p-4">
								<Skeleton className="w-12 h-16 rounded" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-5 w-48" />
									<Skeleton className="h-4 w-32" />
								</div>
								<Skeleton className="h-9 w-16" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
