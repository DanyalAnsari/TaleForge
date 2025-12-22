import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserActions } from "@/components/admin/user-actions";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import { Role } from "@/prisma/generated/prisma/enums";

interface UsersPageProps {
	searchParams: Promise<{ search?: string; role?: string; page?: string }>;
}

const USERS_PER_PAGE = 20;

async function getUsers(search?: string, role?: string, page = 1) {
	const where = {
		...(search && {
			OR: [
				{ name: { contains: search, mode: "insensitive" as const } },
				{ email: { contains: search, mode: "insensitive" as const } },
			],
		}),
		...(role && { role: role as Role }),
	};

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where,
			include: {
				_count: {
					select: { novels: true },
				},
			},
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * USERS_PER_PAGE,
			take: USERS_PER_PAGE,
		}),
		prisma.user.count({ where }),
	]);

	return { users, total, totalPages: Math.ceil(total / USERS_PER_PAGE) };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
	const params = await searchParams;
	const session = await getServerSession();
	const { users, total } = await getUsers(
		params.search,
		params.role,
		Number(params.page) || 1
	);

	const roleColors = {
		READER: "bg-blue-100 text-blue-700",
		AUTHOR: "bg-green-100 text-green-700",
		ADMIN: "bg-purple-100 text-purple-700",
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Users</h1>
				<p className="text-muted-foreground mt-1">
					Manage {total} registered users
				</p>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="pt-6">
					<form className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								name="search"
								placeholder="Search by name or email..."
								defaultValue={params.search}
								className="pl-10"
							/>
						</div>
						<select
							name="role"
							defaultValue={params.role || ""}
							className="px-3 py-2 border rounded-md bg-background"
						>
							<option value="">All Roles</option>
							<option value="READER">Reader</option>
							<option value="AUTHOR">Author</option>
							<option value="ADMIN">Admin</option>
						</select>
						<button
							type="submit"
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
						>
							Filter
						</button>
					</form>
				</CardContent>
			</Card>

			{/* Users Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Users</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Novels</TableHead>
								<TableHead>Joined</TableHead>
								<TableHead className="w-17.5"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div>
											<p className="font-medium">{user.name}</p>
											<p className="text-sm text-muted-foreground">
												{user.email}
											</p>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className={
												roleColors[user.role as keyof typeof roleColors]
											}
										>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={user.isActive ? "default" : "destructive"}>
											{user.isActive ? "Active" : "Inactive"}
										</Badge>
									</TableCell>
									<TableCell>{user._count.novels}</TableCell>
									<TableCell>{formatDate(user.createdAt)}</TableCell>
									<TableCell>
										<UserActions
											userId={user.id}
											userName={user.name}
											currentRole={user.role}
											isActive={user.isActive}
											isCurrentUser={user.id === session?.user.id}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{users.length === 0 && (
						<div className="text-center py-8 text-muted-foreground">
							No users found
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
