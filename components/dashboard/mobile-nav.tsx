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
	User,
	Settings,
	Menu,
	MessageSquare,
	Star,
	Library,
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

export function MobileNav() {
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
					<SheetTitle>Dashboard</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-2 mt-4">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
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
