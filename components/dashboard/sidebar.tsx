"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Library,
	User,
	Settings,
	MessageSquare,
	Star,
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
		title: "My Comments",
		href: "/dashboard/comments",
		icon: MessageSquare,
	},
	{
		title: "My Reviews",
		href: "/dashboard/reviews",
		icon: Star,
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
		<aside className="hidden md:flex w-64 flex-col border-r border-border bg-forge-parchment-deep dark:bg-forge-navy-mid min-h-[calc(100vh-4rem)]">
			<nav className="flex flex-col gap-1 p-4">
				<p className="font-mono text-[0.65rem] uppercase tracking-widest text-forge-gold px-3 py-2 mb-1">
					Dashboard
				</p>
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"forge-sidebar-item forge-focus-ring",
								isActive && "forge-sidebar-item--active",
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
