import Link from "next/link";
import { BookOpen, Github, Twitter } from "lucide-react";

export function Footer() {
	const currentYear = new Date().getFullYear();

	const links = {
		browse: [
			{ label: "All Novels", href: "/novels" },
			{ label: "Ongoing", href: "/novels?status=ONGOING" },
			{ label: "Completed", href: "/novels?status=COMPLETED" },
			{ label: "Popular", href: "/novels?sort=popular" },
		],
		account: [
			{ label: "Sign In", href: "/login" },
			{ label: "Register", href: "/register" },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "My Library", href: "/dashboard/library" },
		],
		authors: [
			{ label: "Start Writing", href: "/author" },
			{ label: "Author Dashboard", href: "/author" },
			{ label: "My Novels", href: "/author/novels" },
			{ label: "Create Novel", href: "/author/novels/new" },
		],
		legal: [
			{ label: "Terms of Service", href: "/terms" },
			{ label: "Privacy Policy", href: "/privacy" },
			{ label: "Content Guidelines", href: "/guidelines" },
			{ label: "DMCA", href: "/dmca" },
		],
	};

	return (
		<footer className="border-t bg-muted/30 w-full px-8">
			<div className="container py-12">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link
							href="/"
							className="flex items-center gap-2 font-bold text-xl"
						>
							<BookOpen className="h-6 w-6" />
							<span>WebNovel</span>
						</Link>
						<p className="text-sm text-muted-foreground mt-4">
							Discover stories, share your imagination, and connect with readers
							worldwide.
						</p>
						<div className="flex gap-4 mt-4">
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<Twitter className="h-5 w-5" />
							</a>
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<Github className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Browse Links */}
					<div>
						<h3 className="font-semibold mb-3">Browse</h3>
						<ul className="space-y-2">
							{links.browse.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Account Links */}
					<div>
						<h3 className="font-semibold mb-3">Account</h3>
						<ul className="space-y-2">
							{links.account.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Authors Links */}
					<div>
						<h3 className="font-semibold mb-3">Authors</h3>
						<ul className="space-y-2">
							{links.authors.map((link, idx) => (
								<li key={idx}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3 className="font-semibold mb-3">Legal</h3>
						<ul className="space-y-2">
							{links.legal.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						© {currentYear} WebNovel. All rights reserved.
					</p>
					<p className="text-sm text-muted-foreground">
						Made with ❤️ for readers and writers
					</p>
				</div>
			</div>
		</footer>
	);
}
