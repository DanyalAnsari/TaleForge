"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPostAuthRedirect } from "@/lib/auth-redirect";

export function LoginForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		const { error: signInError } = await signIn.email({
			email,
			password,
		});

		if (signInError) {
			toast.error(signInError.message || "Invalid email or password");
			setIsLoading(false);
			return;
		}

		toast.success("Welcome back!");
		const redirectUrl = getPostAuthRedirect("/dashboard");
		router.push(redirectUrl);
		router.refresh();
	}

	return (
		<form onSubmit={handleSubmit}>
			{/* Email */}
			<div className="space-y-1.5 mb-5">
				<label
					htmlFor="email"
					className="font-mono text-xs uppercase tracking-wider text-muted-foreground block"
				>
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					placeholder="you@example.com"
					required
					disabled={isLoading}
					className="forge-input w-full px-4 py-2.5 forge-focus-ring"
				/>
			</div>

			{/* Password */}
			<div className="space-y-1.5 mb-5">
				<label
					htmlFor="password"
					className="font-mono text-xs uppercase tracking-wider text-muted-foreground block"
				>
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					placeholder="••••••••"
					required
					disabled={isLoading}
					className="forge-input w-full px-4 py-2.5 forge-focus-ring"
				/>
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={isLoading}
				className="forge-btn-primary w-full py-3 text-sm mt-2 forge-focus-ring inline-flex items-center justify-center transition-colors duration-[var(--duration-fast)] disabled:opacity-50 disabled:pointer-events-none"
			>
				{isLoading ?
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Signing in...
					</>
				:	"Sign in"}
			</button>
		</form>
	);
}
