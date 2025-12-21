"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Library,
	BookOpen,
	User,
	Settings,
} from "lucide-react";

const navItems = [
	{
		title: "Overview",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "My Library",
		href: "/dashboard/library",
		icon: Library,
	},
	{
		title: "Reading History",
		href: "/dashboard/history",
		icon: BookOpen,
	},
	{
		title: "Profile",
		href: "/dashboard/profile",
		icon: User,
	},
	{
		title: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden md:flex w-64 flex-col border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
			<nav className="flex flex-col gap-2 p-4">
				<p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					Dashboard
				</p>
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							)}
						>
							<item.icon className="h-4 w-4" />
							{item.title}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
