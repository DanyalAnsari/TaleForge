"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Users,
	BookOpen,
	Tag,
	Shield,
	Settings,
	BarChart3,
} from "lucide-react";

const navItems = [
	{
		title: "Overview",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Users",
		href: "/admin/users",
		icon: Users,
	},
	{
		title: "Novels",
		href: "/admin/novels",
		icon: BookOpen,
	},
	{
		title: "Tags",
		href: "/admin/tags",
		icon: Tag,
	},
	{
		title: "Analytics",
		href: "/admin/analytics",
		icon: BarChart3,
	},
	{
		title: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden md:flex w-64 flex-col border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
			<nav className="flex flex-col gap-2 p-4">
				<div className="flex items-center gap-2 px-3 py-2 mb-2">
					<Shield className="h-5 w-5 text-primary" />
					<span className="text-sm font-semibold text-primary">
						Admin Panel
					</span>
				</div>
				{navItems.map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href !== "/admin" && pathname.startsWith(item.href));
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
