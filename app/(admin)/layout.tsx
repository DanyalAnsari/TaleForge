import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { Shield } from "lucide-react";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const userRole = (session.user).role || "READER";

	if (userRole !== "ADMIN") {
		return (
			<div className="container mx-auto py-16">
				<div className="max-w-md mx-auto text-center">
					<Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-2">Access Denied</h1>
					<p className="text-muted-foreground mb-6">
						You don&apos;t have permission to access the admin panel. This area
						is restricted to administrators only.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)]">
			<AdminSidebar />
			<div className="flex-1">
				<div className="md:hidden flex items-center gap-2 p-4 border-b">
					<AdminMobileNav />
					<span className="font-semibold">Admin Panel</span>
				</div>
				<main className="p-4 md:p-8">{children}</main>
			</div>
		</div>
	);
}
