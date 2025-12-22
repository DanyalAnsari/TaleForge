import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestActions } from "@/components/admin/request-actions";
import { formatNumber, formatDate } from "@/lib/utils";
import {
	Users,
	BookOpen,
	FileText,
	Eye,
	UserPlus,
	ArrowRight,
} from "lucide-react";

async function getAdminStats() {
	const now = new Date();
	const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

	const [
		totalUsers,
		totalNovels,
		totalChapters,
		totalViews,
		newUsersThisWeek,
		pendingRequests,
		recentUsers,
		recentNovels,
	] = await Promise.all([
		prisma.user.count(),
		prisma.novel.count(),
		prisma.chapter.count(),
		prisma.novel.aggregate({ _sum: { views: true } }),
		prisma.user.count({
			where: { createdAt: { gte: sevenDaysAgo } },
		}),
		prisma.authorRequest.findMany({
			where: { status: "PENDING" },
			include: {
				user: {
					select: { id: true, name: true, email: true, createdAt: true },
				},
			},
			orderBy: { createdAt: "desc" },
			take: 5,
		}),
		prisma.user.findMany({
			orderBy: { createdAt: "desc" },
			take: 5,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		}),
		prisma.novel.findMany({
			orderBy: { createdAt: "desc" },
			take: 5,
			include: {
				author: { select: { name: true } },
				_count: { select: { chapters: true } },
			},
		}),
	]);

	return {
		totalUsers,
		totalNovels,
		totalChapters,
		totalViews: totalViews._sum.views || 0,
		newUsersThisWeek,
		pendingRequests,
		recentUsers,
		recentNovels,
	};
}

export default async function AdminDashboardPage() {
	const stats = await getAdminStats();

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Admin Dashboard</h1>
				<p className="text-muted-foreground mt-1">
					Overview of your platform&apos;s performance
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Link href="/admin/users">
					<Card className="hover:bg-muted/50 transition-colors cursor-pointer">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Users</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{formatNumber(stats.totalUsers)}
							</div>
							<p className="text-xs text-muted-foreground">
								+{stats.newUsersThisWeek} this week
							</p>
						</CardContent>
					</Card>
				</Link>
				<Link href="/admin/novels">
					<Card className="hover:bg-muted/50 transition-colors cursor-pointer">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Novels
							</CardTitle>
							<BookOpen className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{formatNumber(stats.totalNovels)}
							</div>
						</CardContent>
					</Card>
				</Link>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Chapters
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalChapters)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalViews)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Pending Author Requests */}
			{stats.pendingRequests.length > 0 && (
				<Card className="border-yellow-500/50">
					<CardHeader className="flex flex-row items-center justify-between">
						<div className="flex items-center gap-2">
							<UserPlus className="h-5 w-5 text-yellow-500" />
							<CardTitle>Pending Author Requests</CardTitle>
							<Badge
								variant="secondary"
								className="bg-yellow-100 text-yellow-700"
							>
								{stats.pendingRequests.length}
							</Badge>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/admin/requests">
								View All
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.pendingRequests.map((request) => (
								<div
									key={request.id}
									className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
								>
									<div>
										<p className="font-medium">{request.user.name}</p>
										<p className="text-sm text-muted-foreground">
											{request.user.email}
										</p>
										<p className="text-xs text-muted-foreground">
											Requested {formatDate(request.createdAt)}
										</p>
									</div>
									<RequestActions
										requestId={request.id}
										userName={request.user.name}
									/>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Recent Activity */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Recent Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between"
								>
									<div>
										<p className="font-medium">{user.name}</p>
										<p className="text-sm text-muted-foreground">
											{user.email}
										</p>
									</div>
									<span
										className={`text-xs px-2 py-1 rounded-full ${
											user.role === "ADMIN"
												? "bg-purple-100 text-purple-700"
												: user.role === "AUTHOR"
												? "bg-green-100 text-green-700"
												: "bg-blue-100 text-blue-700"
										}`}
									>
										{user.role}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Novels</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentNovels.map((novel) => (
								<div
									key={novel.id}
									className="flex items-center justify-between"
								>
									<div>
										<p className="font-medium">{novel.title}</p>
										<p className="text-sm text-muted-foreground">
											by {novel.author.name} • {novel._count.chapters} chapters
										</p>
									</div>
									<span
										className={`text-xs px-2 py-1 rounded-full ${
											novel.isVisible
												? "bg-green-100 text-green-700"
												: "bg-yellow-100 text-yellow-700"
										}`}
									>
										{novel.isVisible ? "Visible" : "Hidden"}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
