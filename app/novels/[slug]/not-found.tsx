import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookX, BookOpen, Search } from "lucide-react";

export default function NovelNotFound() {
	return (
		<div className="w-full container flex flex-col items-center justify-center min-h-[60vh] text-center mx-auto">
			<BookX className="h-20 w-20 text-muted-foreground mb-6" />
			<h1 className="text-3xl font-bold mb-2">Novel Not Found</h1>
			<p className="text-muted-foreground mb-8 max-w-md">
				The novel you&apos;re looking for doesn&apos;t exist or may have been
				removed.
			</p>
			<div className="flex gap-4">
				<Button asChild>
					<Link href="/novels">
						<BookOpen className="mr-2 h-4 w-4" />
						Browse Novels
					</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/search">
						<Search className="mr-2 h-4 w-4" />
						Search
					</Link>
				</Button>
			</div>
		</div>
	);
}
