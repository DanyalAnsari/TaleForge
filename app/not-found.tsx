import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
	return (
		<div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
			<FileQuestion className="h-20 w-20 text-muted-foreground mb-6" />
			<h1 className="text-4xl font-bold mb-2">404</h1>
			<h2 className="text-xl text-muted-foreground mb-6">Page Not Found</h2>
			<p className="text-muted-foreground mb-8 max-w-md">
				The page you&apos;re looking for doesn&apos;t exist or has been moved.
			</p>
			<div className="flex gap-4">
				<Button asChild>
					<Link href="/">
						<Home className="mr-2 h-4 w-4" />
						Go Home
					</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/novels">
						<Search className="mr-2 h-4 w-4" />
						Browse Novels
					</Link>
				</Button>
			</div>
		</div>
	);
}
