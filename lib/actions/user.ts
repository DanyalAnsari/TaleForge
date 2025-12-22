"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

export async function updateUserName(name: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	if (!name.trim()) {
		return { error: "Name cannot be empty" };
	}

	if (name.length > 100) {
		return { error: "Name is too long" };
	}

	try {
		await prisma.user.update({
			where: { id: session.user.id },
			data: { name: name.trim() },
		});

		revalidatePath("/dashboard/profile");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Failed to update name:", error);
		return { error: "Failed to update name" };
	}
}

export async function getUserStats(userId: string) {
	const [libraryCount, commentsCount, reviewsCount] = await Promise.all([
		prisma.libraryEntry.count({ where: { userId } }),
		prisma.chapterComment.count({ where: { userId } }),
		prisma.novelReview.count({ where: { userId } }),
	]);

	return { libraryCount, commentsCount, reviewsCount };
}
