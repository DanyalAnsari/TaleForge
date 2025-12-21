// app/(auth)/login/page.tsx

import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Welcome back</h1>
					<p className="text-muted-foreground mt-2">
						Sign in to continue reading
					</p>
				</div>

				<LoginForm />

				<p className="text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="text-primary hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
