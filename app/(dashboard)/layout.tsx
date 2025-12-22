import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { headers } from "next/headers";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	if (!session) {
		const headersList = await headers();
		const pathname = headersList.get("x-pathname") || "/dashboard";
		redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)]">
			<Sidebar />
			<div className="flex-1">
				<div className="md:hidden flex items-center gap-2 p-4 border-b">
					<MobileNav />
					<span className="font-semibold">Dashboard</span>
				</div>
				<main className="p-4 md:p-8">{children}</main>
			</div>
		</div>
	);
}
