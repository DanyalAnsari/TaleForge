"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPostAuthRedirect } from "@/lib/auth-redirect";

export function RegisterForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	function clearError(field: string) {
		setErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		const validationErrors: Record<string, string> = {};

		if (password.length < 8) {
			validationErrors.password = "Password must be at least 8 characters";
		}

		if (password !== confirmPassword) {
			validationErrors.confirmPassword = "Passwords do not match";
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			setIsLoading(false);
			return;
		}

		const { error: signUpError } = await signUp.email({
			name,
			email,
			password,
		});

		if (signUpError) {
			toast.error(signUpError.message || "Failed to create account");
			setIsLoading(false);
			return;
		}

		toast.success("Account created successfully!");
		const redirectUrl = getPostAuthRedirect("/dashboard");
		router.push(redirectUrl);
		router.refresh();
	}

	return (
		<form onSubmit={handleSubmit}>
			{/* Name */}
			<div className="space-y-1.5 mb-5">
				<label
					htmlFor="name"
					className="font-mono text-xs uppercase tracking-wider text-muted-foreground block"
				>
					Name
				</label>
				<input
					id="name"
					name="name"
					type="text"
					placeholder="Your name"
					required
					disabled={isLoading}
					onChange={() => clearError("name")}
					className="forge-input w-full px-4 py-2.5 forge-focus-ring"
				/>
			</div>

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
					onChange={() => clearError("email")}
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
					onChange={() => clearError("password")}
					className={`forge-input w-full px-4 py-2.5 forge-focus-ring ${
						errors.password ? "border-[var(--forge-crimson)]" : ""
					}`}
				/>
				{errors.password && (
					<p className="font-[var(--font-mono)] text-xs text-forge-crimson mt-1">
						{errors.password}
					</p>
				)}
			</div>

			{/* Confirm Password */}
			<div className="space-y-1.5 mb-5">
				<label
					htmlFor="confirmPassword"
					className="font-mono text-xs uppercase tracking-wider text-muted-foreground block"
				>
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					placeholder="••••••••"
					required
					disabled={isLoading}
					onChange={() => clearError("confirmPassword")}
					className={`forge-input w-full px-4 py-2.5 forge-focus-ring ${
						errors.confirmPassword ? "border-[var(--forge-crimson)]" : ""
					}`}
				/>
				{errors.confirmPassword && (
					<p className="font-[var(--font-mono)] text-xs text-forge-crimson mt-1">
						{errors.confirmPassword}
					</p>
				)}
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
						Creating account...
					</>
				:	"Create account"}
			</button>
		</form>
	);
}
