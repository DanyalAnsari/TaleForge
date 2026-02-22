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

	const linkClasses =
		"text-sm text-muted-foreground hover:text-foreground transition-colors duration-[var(--duration-fast)]";

	const headingClasses =
		"font-mono text-xs uppercase tracking-widest text-forge-gold mb-3";

	return (
		<footer className="border-t border-border bg-forge-parchment-deep dark:bg-forge-navy-mid w-full">
			<div className="forge-content-container forge-section">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link
							href="/"
							className="forge-focus-ring flex items-center gap-2 transition-colors duration-(--duration-fast)"
						>
							<BookOpen
								className="h-5 w-5 text-forge-gold"
								strokeWidth={1.75}
							/>
							<span className="font-(--font-serif) text-xl">
								TaleForge
							</span>
						</Link>
						<p className="font-(--font-mono) text-xs text-muted-foreground tracking-wide mt-2">
							Discover stories, share your imagination, and connect with readers
							worldwide.
						</p>
						<div className="flex gap-2 mt-4">
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="forge-btn-ghost forge-focus-ring inline-flex items-center justify-center h-9 w-9 transition-colors duration-(--duration-fast)"
							>
								<Twitter className="h-4 w-4" />
								<span className="sr-only">Twitter</span>
							</a>
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="forge-btn-ghost forge-focus-ring inline-flex items-center justify-center h-9 w-9 transition-colors duration-(--duration-fast)"
							>
								<Github className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</a>
						</div>
					</div>

					{/* Browse Links */}
					<div>
						<h3 className={headingClasses}>Browse</h3>
						<ul className="space-y-2">
							{links.browse.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className={`${linkClasses} forge-focus-ring`}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Account Links */}
					<div>
						<h3 className={headingClasses}>Account</h3>
						<ul className="space-y-2">
							{links.account.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className={`${linkClasses} forge-focus-ring`}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Authors Links */}
					<div>
						<h3 className={headingClasses}>Authors</h3>
						<ul className="space-y-2">
							{links.authors.map((link, idx) => (
								<li key={idx}>
									<Link
										href={link.href}
										className={`${linkClasses} forge-focus-ring`}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3 className={headingClasses}>Legal</h3>
						<ul className="space-y-2">
							{links.legal.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className={`${linkClasses} forge-focus-ring`}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="font-(--font-mono) text-xs text-muted-foreground">
						© {currentYear} TaleForge. All rights reserved.
					</p>
					<p className="font-(--font-mono) text-xs text-muted-foreground">
						Made with ♥ for readers and writers
					</p>
				</div>
			</div>
		</footer>
	);
}
