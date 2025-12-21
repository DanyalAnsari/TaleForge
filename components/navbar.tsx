import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export async function Navbar() {
	const session = await getServerSession();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-6">
					<Link href="/" className="flex items-center gap-2 font-bold text-xl">
						<BookOpen className="h-6 w-6" />
						<span>WebNovel</span>
					</Link>

					<nav className="hidden md:flex items-center gap-6">
						<Link
							href="/novels"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							Browse
						</Link>
						<Link
							href="/search"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							Search
						</Link>
					</nav>
				</div>

				<div className="flex items-center gap-4">
					{session ? (
						<UserMenu user={session.user} />
					) : (
						<div className="flex items-center gap-2">
							<Button variant="ghost" asChild>
								<Link href="/login">Sign in</Link>
							</Button>
							<Button asChild>
								<Link href="/register">Sign up</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
