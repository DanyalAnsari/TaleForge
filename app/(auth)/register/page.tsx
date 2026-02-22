import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function RegisterPage() {
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
							Join TaleForge
						</h1>
						<div
							className="forge-divider w-16 mx-auto my-3"
							aria-hidden="true"
						/>
						<p className="font-mono text-xs text-muted-foreground tracking-wide">
							Create an account to start your adventure
						</p>
					</div>

					{/* Form */}
					<RegisterForm />

					{/* Footer link */}
					<p className="font-mono text-xs text-muted-foreground text-center mt-6">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-forge-gold hover:text-forge-gold-dim transition-colors duration-[var(--duration-fast)] forge-focus-ring"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
