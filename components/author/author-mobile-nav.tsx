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
import { Separator } from "@/components/ui/separator";
import {
	LayoutDashboard,
	BookOpen,
	PlusCircle,
	BarChart3,
	Settings,
	Menu,
	MessageSquare,
	User,
} from "lucide-react";

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

export function AuthorMobileNav() {
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
					<SheetTitle>Author Dashboard</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-2 mt-4">
					{navItems.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.href !== "/author" && pathname.startsWith(item.href));
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

					<Separator className="my-2" />

					<p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Quick Links
					</p>
					<Link
						href="/dashboard"
						onClick={() => setOpen(false)}
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					>
						<User className="h-4 w-4" />
						Reader Dashboard
					</Link>
					<Link
						href="/novels"
						onClick={() => setOpen(false)}
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					>
						<BookOpen className="h-4 w-4" />
						Browse Novels
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
