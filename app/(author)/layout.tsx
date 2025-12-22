import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { AuthorSidebar } from "@/components/author/author-sidebar";
import { AuthorMobileNav } from "@/components/author/author-mobile-nav";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AuthorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	const userRole = (session.user as any).role || "READER";

	// If user is a READER, show upgrade prompt
	if (userRole === "READER") {
		return (
			<div className="container py-16">
				<div className="max-w-md mx-auto text-center">
					<AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-2">Become an Author</h1>
					<p className="text-muted-foreground mb-6">
						You need to be an author to access this section. Apply to become an
						author and start publishing your stories!
					</p>
					<Alert>
						<AlertDescription>
							To become an author, please contact our support team or upgrade
							your account in{" "}
							<Link
								href="/dashboard/settings"
								className="text-primary underline"
							>
								settings
							</Link>
							.
						</AlertDescription>
					</Alert>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)]">
			<AuthorSidebar />
			<div className="flex-1">
				<div className="md:hidden flex items-center gap-2 p-4 border-b">
					<AuthorMobileNav />
					<span className="font-semibold">Author Dashboard</span>
				</div>
				<main className="p-4 md:p-8">{children}</main>
			</div>
		</div>
	);
}
