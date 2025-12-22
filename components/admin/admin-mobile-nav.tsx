"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	LayoutDashboard,
	Users,
	BookOpen,
	Tag,
	Shield,
	Settings,
	BarChart3,
	Menu,
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

export function AdminMobileNav() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-64">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-primary" />
						Admin Panel
					</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-2 mt-4">
					{navItems.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.href !== "/admin" && pathname.startsWith(item.href));
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setOpen(false)}
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
			</SheetContent>
		</Sheet>
	);
}
