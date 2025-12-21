// app/(auth)/register/page.tsx

import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Create an account</h1>
					<p className="text-muted-foreground mt-2">
						Join our community of readers and writers
					</p>
				</div>

				<RegisterForm />

				<p className="text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link href="/login" className="text-primary hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
