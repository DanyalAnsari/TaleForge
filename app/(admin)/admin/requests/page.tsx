import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestActions } from "@/components/admin/request-actions";
import { formatDate } from "@/lib/utils";
import { UserPlus, Clock, CheckCircle, XCircle } from "lucide-react";

async function getRequests() {
	const [pending, approved, rejected] = await Promise.all([
		prisma.authorRequest.findMany({
			where: { status: "PENDING" },
			include: {
				user: {
					select: { id: true, name: true, email: true, createdAt: true },
				},
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.authorRequest.findMany({
			where: { status: "APPROVED" },
			include: { user: { select: { id: true, name: true, email: true } } },
			orderBy: { updatedAt: "desc" },
			take: 50,
		}),
		prisma.authorRequest.findMany({
			where: { status: "REJECTED" },
			include: { user: { select: { id: true, name: true, email: true } } },
			orderBy: { updatedAt: "desc" },
			take: 50,
		}),
	]);

	return { pending, approved, rejected };
}

export default async function RequestsPage() {
	const { pending, approved, rejected } = await getRequests();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Author Requests</h1>
				<p className="text-muted-foreground mt-1">
					Manage requests from users who want to become authors
				</p>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending</CardTitle>
						<Clock className="h-4 w-4 text-yellow-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{pending.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Approved</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{approved.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Rejected</CardTitle>
						<XCircle className="h-4 w-4 text-red-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{rejected.length}</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="pending">
				<TabsList>
					<TabsTrigger value="pending" className="gap-2">
						Pending
						{pending.length > 0 && (
							<Badge variant="secondary" className="ml-1">
								{pending.length}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="approved">Approved</TabsTrigger>
					<TabsTrigger value="rejected">Rejected</TabsTrigger>
				</TabsList>

				{/* Pending Tab */}
				<TabsContent value="pending">
					<Card>
						<CardHeader>
							<CardTitle>Pending Requests</CardTitle>
						</CardHeader>
						<CardContent>
							{pending.length > 0 ? (
								<div className="space-y-4">
									{pending.map((request) => (
										<div
											key={request.id}
											className="border rounded-lg p-4 space-y-3"
										>
											<div className="flex items-start justify-between">
												<div>
													<p className="font-medium">{request.user.name}</p>
													<p className="text-sm text-muted-foreground">
														{request.user.email}
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														Member since {formatDate(request.user.createdAt)} •
														Requested {formatDate(request.createdAt)}
													</p>
												</div>
												<RequestActions
													requestId={request.id}
													userName={request.user.name}
												/>
											</div>
											<div className="bg-muted/50 p-3 rounded text-sm">
												<p className="font-medium text-xs text-muted-foreground mb-1">
													Reason:
												</p>
												{request.reason}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-muted-foreground">No pending requests</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Approved Tab */}
				<TabsContent value="approved">
					<Card>
						<CardHeader>
							<CardTitle>Approved Requests</CardTitle>
						</CardHeader>
						<CardContent>
							{approved.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>User</TableHead>
											<TableHead>Approved On</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{approved.map((request) => (
											<TableRow key={request.id}>
												<TableCell>
													<div>
														<p className="font-medium">{request.user.name}</p>
														<p className="text-sm text-muted-foreground">
															{request.user.email}
														</p>
													</div>
												</TableCell>
												<TableCell>{formatDate(request.updatedAt)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p className="text-center py-8 text-muted-foreground">
									No approved requests yet
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Rejected Tab */}
				<TabsContent value="rejected">
					<Card>
						<CardHeader>
							<CardTitle>Rejected Requests</CardTitle>
						</CardHeader>
						<CardContent>
							{rejected.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>User</TableHead>
											<TableHead>Rejected On</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{rejected.map((request) => (
											<TableRow key={request.id}>
												<TableCell>
													<div>
														<p className="font-medium">{request.user.name}</p>
														<p className="text-sm text-muted-foreground">
															{request.user.email}
														</p>
													</div>
												</TableCell>
												<TableCell>{formatDate(request.updatedAt)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p className="text-center py-8 text-muted-foreground">
									No rejected requests
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
