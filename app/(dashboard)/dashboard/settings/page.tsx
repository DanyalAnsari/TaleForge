import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthorRequestForm } from "@/components/dashboard/author-request-form";
import { User, PenTool, Shield } from "lucide-react";

export default async function SettingsPage() {
	const session = await getServerSession();

	if (!session) return null;

	const userRole = session.user.role || "READER";

	// Get author request if user is a reader
	let authorRequest = null;
	if (userRole === "READER") {
		authorRequest = await prisma.authorRequest.findUnique({
			where: { userId: session.user.id },
		});
	}

	const roleInfo = {
		READER: {
			icon: User,
			label: "Reader",
			description: "You can read novels, add to library, and leave reviews.",
			color: "bg-blue-100 text-blue-700",
		},
		AUTHOR: {
			icon: PenTool,
			label: "Author",
			description: "You can create and publish your own novels.",
			color: "bg-green-100 text-green-700",
		},
		ADMIN: {
			icon: Shield,
			label: "Administrator",
			description: "You have full access to manage the platform.",
			color: "bg-purple-100 text-purple-700",
		},
	};

	const currentRole = roleInfo[userRole as keyof typeof roleInfo];
	const RoleIcon = currentRole.icon;

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h1 className="text-3xl font-bold">Settings</h1>
				<p className="text-muted-foreground mt-1">
					Manage your account settings
				</p>
			</div>

			{/* Role Section */}
			<Card>
				<CardHeader>
					<CardTitle>Account Role</CardTitle>
					<CardDescription>
						Your current permissions on the platform
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-full ${currentRole.color}`}>
							<RoleIcon className="h-5 w-5" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<span className="font-medium">{currentRole.label}</span>
								<Badge variant="secondary" className={currentRole.color}>
									Current
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								{currentRole.description}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Author Request Section - Only for Readers */}
			{userRole === "READER" && (
				<AuthorRequestForm existingRequest={authorRequest} />
			)}
		</div>
	);
}
