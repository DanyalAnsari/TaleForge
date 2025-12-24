import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX, BookOpen, ArrowLeft } from "lucide-react";

export default function ChapterNotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<FileX className="h-20 w-20 text-muted-foreground mb-6" />
			<h1 className="text-3xl font-bold mb-2">Chapter Not Found</h1>
			<p className="text-muted-foreground mb-8 max-w-md">
				This chapter doesn&apos;t exist or hasn&apos;t been published yet.
			</p>
			<div className="flex gap-4">
				<Button variant="outline" onClick={() => window.history.back()}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Go Back
				</Button>
				<Button asChild>
					<Link href="/novels">
						<BookOpen className="mr-2 h-4 w-4" />
						Browse Novels
					</Link>
				</Button>
			</div>
		</div>
	);
}
