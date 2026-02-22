import { LoginForm } from "@/components/auth/login-form";
import { RedirectSaver } from "@/components/auth/redirect-saver";
import { getServerSession } from "@/lib/auth-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";

interface LoginPageProps {
	searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const session = await getServerSession();

	if (session) {
		redirect("/dashboard");
	}

	const params = await searchParams;
	const redirectUrl = params.redirect;

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center forge-section bg-[var(--background)]">
			<div className="forge-narrow-container w-full">
				<div className="forge-card p-8 lg:p-10">
					{/* Header */}
					<div className="text-center mb-8">
						<BookOpen
							className="h-8 w-8 text-forge-gold mx-auto mb-4"
							strokeWidth={1.75}
						/>
						<h1 className="font-serif text-2xl font-bold mb-1">
							Welcome Back
						</h1>
						<div
							className="forge-divider w-16 mx-auto my-3"
							aria-hidden="true"
						/>
						<p className="font-mono text-xs text-muted-foreground tracking-wide">
							Sign in to continue your reading journey
						</p>
					</div>

					{redirectUrl && <RedirectSaver url={redirectUrl} />}

					{/* Form */}
					<LoginForm />

					{/* Footer link */}
					<p className="font-mono text-xs text-muted-foreground text-center mt-6">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="text-forge-gold hover:text-forge-gold-dim transition-colors duration-[var(--duration-fast)] forge-focus-ring"
						>
							Create one
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
