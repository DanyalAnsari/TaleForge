import prisma from "@/lib/prisma";
import { NovelForm } from "@/components/author/novel-form";

async function getTags() {
	return prisma.tag.findMany({
		orderBy: { name: "asc" },
	});
}

export default async function CreateNovelPage() {
	const tags = await getTags();

	return (
		<div className="max-w-2xl">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Create Novel</h1>
				<p className="text-muted-foreground mt-1">
					Start your new story by filling in the details below
				</p>
			</div>

			<NovelForm tags={tags} />
		</div>
	);
}
