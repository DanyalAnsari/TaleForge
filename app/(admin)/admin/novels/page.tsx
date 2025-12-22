import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NovelActions } from "@/components/admin/novel-actions";
import { formatDate, formatNumber } from "@/lib/utils";
import { Search, BookOpen } from "lucide-react";
import { NovelStatus } from "@/prisma/generated/prisma/enums";

interface NovelsPageProps {
	searchParams: Promise<{
		search?: string;
		status?: string;
		visibility?: string;
		page?: string;
	}>;
}

const NOVELS_PER_PAGE = 20;

async function getNovels(
	search?: string,
	status?: string,
	visibility?: string,
	page = 1
) {
	const where = {
		...(search && {
			OR: [
				{ title: { contains: search, mode: "insensitive" as const } },
				{
					author: { name: { contains: search, mode: "insensitive" as const } },
				},
			],
		}),
		...(status && { status: status as NovelStatus }),
		...(visibility === "visible" && { isVisible: true }),
		...(visibility === "hidden" && { isVisible: false }),
	};

	const [novels, total] = await Promise.all([
		prisma.novel.findMany({
			where,
			include: {
				author: { select: { name: true, email: true } },
				_count: { select: { chapters: true } },
			},
			orderBy: { updatedAt: "desc" },
			skip: (page - 1) * NOVELS_PER_PAGE,
			take: NOVELS_PER_PAGE,
		}),
		prisma.novel.count({ where }),
	]);

	return { novels, total, totalPages: Math.ceil(total / NOVELS_PER_PAGE) };
}

export default async function AdminNovelsPage({
	searchParams,
}: NovelsPageProps) {
	const params = await searchParams;
	const { novels, total } = await getNovels(
		params.search,
		params.status,
		params.visibility,
		Number(params.page) || 1
	);

	const statusColors = {
		ONGOING: "bg-green-100 text-green-700",
		COMPLETED: "bg-blue-100 text-blue-700",
		HIATUS: "bg-yellow-100 text-yellow-700",
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Novels</h1>
				<p className="text-muted-foreground mt-1">
					Manage {total} novels on the platform
				</p>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="pt-6">
					<form className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								name="search"
								placeholder="Search by title or author..."
								defaultValue={params.search}
								className="pl-10"
							/>
						</div>
						<select
							name="status"
							defaultValue={params.status || ""}
							className="px-3 py-2 border rounded-md bg-background"
						>
							<option value="">All Status</option>
							<option value="ONGOING">Ongoing</option>
							<option value="COMPLETED">Completed</option>
							<option value="HIATUS">Hiatus</option>
						</select>
						<select
							name="visibility"
							defaultValue={params.visibility || ""}
							className="px-3 py-2 border rounded-md bg-background"
						>
							<option value="">All Visibility</option>
							<option value="visible">Visible</option>
							<option value="hidden">Hidden</option>
						</select>
						<button
							type="submit"
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
						>
							Filter
						</button>
					</form>
				</CardContent>
			</Card>

			{/* Novels Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Novels</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Novel</TableHead>
								<TableHead>Author</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Visibility</TableHead>
								<TableHead>Chapters</TableHead>
								<TableHead>Views</TableHead>
								<TableHead>Updated</TableHead>
								<TableHead className="w-17.5"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{novels.map((novel) => (
								<TableRow key={novel.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="relative w-10 h-14 shrink-0">
												{novel.coverImageUrl ? (
													<Image
														src={novel.coverImageUrl}
														alt={novel.title}
														fill
														className="object-cover rounded"
														sizes="40px"
													/>
												) : (
													<div className="w-full h-full bg-muted rounded flex items-center justify-center">
														<BookOpen className="h-4 w-4 text-muted-foreground" />
													</div>
												)}
											</div>
											<div>
												<Link
													href={`/novels/${novel.slug}`}
													target="_blank"
													className="font-medium hover:text-primary"
												>
													{novel.title}
												</Link>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<p className="font-medium">{novel.author.name}</p>
											<p className="text-xs text-muted-foreground">
												{novel.author.email}
											</p>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className={
												statusColors[novel.status as keyof typeof statusColors]
											}
										>
											{novel.status}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge
											variant={novel.isVisible ? "default" : "destructive"}
										>
											{novel.isVisible ? "Visible" : "Hidden"}
										</Badge>
									</TableCell>
									<TableCell>{novel._count.chapters}</TableCell>
									<TableCell>{formatNumber(novel.views)}</TableCell>
									<TableCell>{formatDate(novel.updatedAt)}</TableCell>
									<TableCell>
										<NovelActions
											novelId={novel.id}
											novelTitle={novel.title}
											novelSlug={novel.slug}
											isVisible={novel.isVisible}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{novels.length === 0 && (
						<div className="text-center py-8 text-muted-foreground">
							No novels found
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
