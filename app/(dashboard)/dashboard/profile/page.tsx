import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditNameForm } from "@/components/dashboard/edit-name-form";
import { formatDate } from "@/lib/utils";
import {
	User,
	Mail,
	Shield,
	Calendar,
	Library,
	MessageSquare,
	Star,
} from "lucide-react";

async function getUserStats(userId: string) {
	const [libraryCount, commentsCount, reviewsCount] = await Promise.all([
		prisma.libraryEntry.count({ where: { userId } }),
		prisma.chapterComment.count({ where: { userId } }),
		prisma.novelReview.count({ where: { userId } }),
	]);

	return { libraryCount, commentsCount, reviewsCount };
}

export default async function ProfilePage() {
	const session = await getServerSession();

	if (!session) return null;

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			createdAt: true,
			image: true,
		},
	});

	if (!user) return null;

	const stats = await getUserStats(user.id);

	const roleColors = {
		READER: "bg-blue-100 text-blue-700",
		AUTHOR: "bg-green-100 text-green-700",
		ADMIN: "bg-purple-100 text-purple-700",
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h1 className="text-3xl font-bold">Profile</h1>
				<p className="text-muted-foreground mt-1">
					View and manage your account information
				</p>
			</div>

			{/* Profile Information */}
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-start gap-4">
						<User className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div className="flex-1">
							<p className="text-sm text-muted-foreground mb-1">Name</p>
							<EditNameForm currentName={user.name} />
						</div>
					</div>

					<div className="flex items-start gap-4">
						<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div>
							<p className="text-sm text-muted-foreground mb-1">Email</p>
							<p className="font-medium">{user.email}</p>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div>
							<p className="text-sm text-muted-foreground mb-1">Role</p>
							<Badge
								className={roleColors[user.role as keyof typeof roleColors]}
							>
								{user.role}
							</Badge>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div>
							<p className="text-sm text-muted-foreground mb-1">Member Since</p>
							<p className="font-medium">{formatDate(user.createdAt)}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Activity Stats */}
			<Card>
				<CardHeader>
					<CardTitle>Activity</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<Library className="h-6 w-6 mx-auto text-primary mb-2" />
							<p className="text-2xl font-bold">{stats.libraryCount}</p>
							<p className="text-sm text-muted-foreground">In Library</p>
						</div>
						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<MessageSquare className="h-6 w-6 mx-auto text-primary mb-2" />
							<p className="text-2xl font-bold">{stats.commentsCount}</p>
							<p className="text-sm text-muted-foreground">Comments</p>
						</div>
						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<Star className="h-6 w-6 mx-auto text-primary mb-2" />
							<p className="text-2xl font-bold">{stats.reviewsCount}</p>
							<p className="text-sm text-muted-foreground">Reviews</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
