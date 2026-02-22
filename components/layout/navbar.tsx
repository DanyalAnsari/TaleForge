import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { UserMenu } from "@/components/layout/user-menu";
import { BookOpen } from "lucide-react";
import { User } from "@/prisma/generated/prisma/client";
import { ThemeToggle } from "./theme-toggle";

export async function Navbar() {
	const session = await getServerSession();

	return (
		<header className="sticky top-0 z-(--z-sticky) h-16 w-full border-b border-border bg-[oklch(from_var(--background)_l_c_h/90%)] backdrop-blur-md flex items-center justify-center px-4 lg:px-2">
			<div className="forge-content-container w-full flex h-full items-center justify-between">
				{/* Left side */}
				<div className="flex items-center gap-12">
					<Link
						href="/"
						className="forge-focus-ring flex items-center gap-2 transition-colors duration-(--duration-fast)"
					>
						<BookOpen
							className="h-5 w-5 text-forge-gold"
							strokeWidth={1.75}
						/>
						<span className="font-serif text-forge-gradient text-xl">
							TaleForge
						</span>
					</Link>

					{/* Nav links — hidden on mobile, no hamburger per spec */}
					<nav className="hidden md:flex items-center gap-6">
						<Link
							href="/novels"
							className="forge-focus-ring font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-(--duration-fast)"
						>
							Browse
						</Link>
						<Link
							href="/search"
							className="forge-focus-ring font-(--font-mono) text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-(--duration-fast)"
						>
							Search
						</Link>
					</nav>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-4">
					<ThemeToggle />
					{session ?
						<UserMenu user={session.user as User} />
					:	<div className="flex items-center gap-2">
							<Link
								href="/login"
								className="forge-btn-ghost forge-focus-ring transition-colors duration-(--duration-fast)"
							>
								Sign in
							</Link>
							<Link
								href="/register"
								className="forge-btn-primary forge-focus-ring transition-colors duration-(--duration-fast)"
							>
								Sign up
							</Link>
						</div>
					}
				</div>
			</div>
		</header>
	);
}
