"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	BookOpen,
	PlusCircle,
	BarChart3,
	Settings,
	MessageSquare,
	User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navItems = [
	{
		title: "Overview",
		href: "/author",
		icon: LayoutDashboard,
	},
	{
		title: "My Novels",
		href: "/author/novels",
		icon: BookOpen,
	},
	{
		title: "Create Novel",
		href: "/author/novels/new",
		icon: PlusCircle,
	},
	{
		title: "Feedback",
		href: "/author/feedback",
		icon: MessageSquare,
	},
	{
		title: "Analytics",
		href: "/author/analytics",
		icon: BarChart3,
	},
	{
		title: "Settings",
		href: "/author/settings",
		icon: Settings,
	},
];

export function AuthorSidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden md:flex w-64 flex-col border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
			<nav className="flex flex-col gap-2 p-4">
				<p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					Author Dashboard
				</p>
				{navItems.map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href !== "/author" && pathname.startsWith(item.href));
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

				<Separator className="my-2" />

				<p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					Quick Links
				</p>
				<Link
					href="/dashboard"
					className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
				>
					<User className="h-4 w-4" />
					Reader Dashboard
				</Link>
				<Link
					href="/novels"
					className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
				>
					<BookOpen className="h-4 w-4" />
					Browse Novels
				</Link>
			</nav>
		</aside>
	);
}
