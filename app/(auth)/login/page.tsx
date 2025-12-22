import { LoginForm } from "@/components/auth/login-form";
import { RedirectSaver } from "@/components/auth/redirect-saver";
import { getServerSession } from "@/lib/auth-server";
import Link from "next/link";
import { redirect } from "next/navigation";

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
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Welcome back</h1>
					<p className="text-muted-foreground mt-2">
						Sign in to continue reading
					</p>
				</div>

				{redirectUrl && <RedirectSaver url={redirectUrl} />}

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
