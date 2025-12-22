import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import {
	Users,
	BookOpen,
	FileText,
	Eye,
	TrendingUp,
	UserPlus,
} from "lucide-react";

async function getAdminStats() {
	const now = new Date();
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
	const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

	const [
		totalUsers,
		totalNovels,
		totalChapters,
		totalViews,
		newUsersThisWeek,
		newNovelsThisMonth,
		usersByRole,
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
		prisma.novel.count({
			where: { createdAt: { gte: thirtyDaysAgo } },
		}),
		prisma.user.groupBy({
			by: ["role"],
			_count: { role: true },
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

	const roleStats = usersByRole.reduce((acc, { role, _count }) => {
		acc[role] = _count.role;
		return acc;
	}, {} as Record<string, number>);

	return {
		totalUsers,
		totalNovels,
		totalChapters,
		totalViews: totalViews._sum.views || 0,
		newUsersThisWeek,
		newNovelsThisMonth,
		roleStats,
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
				<Card>
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
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Novels</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(stats.totalNovels)}
						</div>
						<p className="text-xs text-muted-foreground">
							+{stats.newNovelsThisMonth} this month
						</p>
					</CardContent>
				</Card>
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

			{/* User Role Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Readers</CardTitle>
						<Users className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.roleStats.READER || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Authors</CardTitle>
						<UserPlus className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.roleStats.AUTHOR || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Admins</CardTitle>
						<TrendingUp className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.roleStats.ADMIN || 0}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Recent Users */}
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

				{/* Recent Novels */}
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
