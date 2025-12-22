"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

export async function createComment(chapterId: string, content: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in to comment" };
	}

	if (!content.trim()) {
		return { error: "Comment cannot be empty" };
	}

	if (content.length > 2000) {
		return { error: "Comment is too long (max 2000 characters)" };
	}

	try {
		const chapter = await prisma.chapter.findUnique({
			where: { id: chapterId },
			select: { novel: { select: { slug: true } }, chapterNumber: true },
		});

		if (!chapter) {
			return { error: "Chapter not found" };
		}

		const comment = await prisma.chapterComment.create({
			data: {
				content: content.trim(),
				chapterId,
				userId: session.user.id,
			},
			include: {
				user: {
					select: { id: true, name: true, image: true },
				},
			},
		});

		revalidatePath(
			`/novels/${chapter.novel.slug}/chapter/${chapter.chapterNumber}`
		);

		return { success: true, comment };
	} catch (error) {
		console.error("Failed to create comment:", error);
		return { error: "Failed to post comment" };
	}
}

export async function updateComment(commentId: string, content: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	if (!content.trim()) {
		return { error: "Comment cannot be empty" };
	}

	try {
		const comment = await prisma.chapterComment.findUnique({
			where: { id: commentId },
			include: {
				chapter: {
					select: { novel: { select: { slug: true } }, chapterNumber: true },
				},
			},
		});

		if (!comment) {
			return { error: "Comment not found" };
		}

		const userRole = session.user.role;
		if (comment.userId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You can only edit your own comments" };
		}

		await prisma.chapterComment.update({
			where: { id: commentId },
			data: { content: content.trim() },
		});

		revalidatePath(
			`/novels/${comment.chapter.novel.slug}/chapter/${comment.chapter.chapterNumber}`
		);

		return { success: true };
	} catch (error) {
		console.error("Failed to update comment:", error);
		return { error: "Failed to update comment" };
	}
}

export async function deleteComment(commentId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		const comment = await prisma.chapterComment.findUnique({
			where: { id: commentId },
			include: {
				chapter: {
					select: { novel: { select: { slug: true } }, chapterNumber: true },
				},
			},
		});

		if (!comment) {
			return { error: "Comment not found" };
		}

		const userRole = session.user.role;
		if (comment.userId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You can only delete your own comments" };
		}

		await prisma.chapterComment.delete({
			where: { id: commentId },
		});

		revalidatePath(
			`/novels/${comment.chapter.novel.slug}/chapter/${comment.chapter.chapterNumber}`
		);

		return { success: true };
	} catch (error) {
		console.error("Failed to delete comment:", error);
		return { error: "Failed to delete comment" };
	}
}
