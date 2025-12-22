"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

interface ChapterFormData {
	title: string;
	content: string;
	isPublished: boolean;
}

export async function createChapter(novelId: string, data: ChapterFormData) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		// Verify ownership
		const novel = await prisma.novel.findUnique({
			where: { id: novelId },
			select: { authorId: true, slug: true },
		});

		if (!novel) {
			return { error: "Novel not found" };
		}

		const userRole = session.user.role;
		if (novel.authorId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You don't have permission" };
		}

		// Get next chapter number
		const lastChapter = await prisma.chapter.findFirst({
			where: { novelId },
			orderBy: { chapterNumber: "desc" },
			select: { chapterNumber: true },
		});

		const chapterNumber = (lastChapter?.chapterNumber || 0) + 1;

		const chapter = await prisma.chapter.create({
			data: {
				title: data.title,
				content: data.content,
				chapterNumber,
				isPublished: data.isPublished,
				novelId,
			},
		});

		// Update novel's updatedAt
		await prisma.novel.update({
			where: { id: novelId },
			data: { updatedAt: new Date() },
		});

		revalidatePath(`/author/novels/${novelId}/chapters`);
		revalidatePath(`/novels/${novel.slug}`);

		return { success: true, chapterId: chapter.id };
	} catch (error) {
		console.error("Failed to create chapter:", error);
		return { error: "Failed to create chapter" };
	}
}

export async function updateChapter(chapterId: string, data: ChapterFormData) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		const chapter = await prisma.chapter.findUnique({
			where: { id: chapterId },
			include: {
				novel: {
					select: { authorId: true, id: true, slug: true },
				},
			},
		});

		if (!chapter) {
			return { error: "Chapter not found" };
		}

		const userRole = session.user.role;
		if (chapter.novel.authorId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You don't have permission" };
		}

		await prisma.chapter.update({
			where: { id: chapterId },
			data: {
				title: data.title,
				content: data.content,
				isPublished: data.isPublished,
			},
		});

		// Update novel's updatedAt
		await prisma.novel.update({
			where: { id: chapter.novel.id },
			data: { updatedAt: new Date() },
		});

		revalidatePath(`/author/novels/${chapter.novel.id}/chapters`);
		revalidatePath(`/novels/${chapter.novel.slug}`);
		revalidatePath(
			`/novels/${chapter.novel.slug}/chapter/${chapter.chapterNumber}`
		);

		return { success: true };
	} catch (error) {
		console.error("Failed to update chapter:", error);
		return { error: "Failed to update chapter" };
	}
}

export async function deleteChapter(chapterId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		const chapter = await prisma.chapter.findUnique({
			where: { id: chapterId },
			include: {
				novel: {
					select: { authorId: true, id: true, slug: true },
				},
			},
		});

		if (!chapter) {
			return { error: "Chapter not found" };
		}

		const userRole = session.user.role;
		if (chapter.novel.authorId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You don't have permission" };
		}

		await prisma.chapter.delete({
			where: { id: chapterId },
		});

		revalidatePath(`/author/novels/${chapter.novel.id}/chapters`);
		revalidatePath(`/novels/${chapter.novel.slug}`);

		return { success: true, novelId: chapter.novel.id };
	} catch (error) {
		console.error("Failed to delete chapter:", error);
		return { error: "Failed to delete chapter" };
	}
}

export async function toggleChapterPublish(chapterId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		const chapter = await prisma.chapter.findUnique({
			where: { id: chapterId },
			include: {
				novel: {
					select: { authorId: true, id: true, slug: true },
				},
			},
		});

		if (!chapter) {
			return { error: "Chapter not found" };
		}

		const userRole = session.user.role;
		if (chapter.novel.authorId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You don't have permission" };
		}

		const updated = await prisma.chapter.update({
			where: { id: chapterId },
			data: { isPublished: !chapter.isPublished },
		});

		revalidatePath(`/author/novels/${chapter.novel.id}/chapters`);
		revalidatePath(`/novels/${chapter.novel.slug}`);

		return { success: true, isPublished: updated.isPublished };
	} catch (error) {
		console.error("Failed to toggle chapter:", error);
		return { error: "Failed to update chapter" };
	}
}
