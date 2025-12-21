"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

export async function addToLibrary(novelId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in to add to library" };
	}

	try {
		// Check if already in library
		const existing = await prisma.libraryEntry.findUnique({
			where: {
				userId_novelId: {
					userId: session.user.id,
					novelId,
				},
			},
		});

		if (existing) {
			return { error: "Novel already in library" };
		}

		await prisma.libraryEntry.create({
			data: {
				userId: session.user.id,
				novelId,
			},
		});

		revalidatePath(`/novels/[slug]`, "page");
		revalidatePath("/dashboard");
		revalidatePath("/dashboard/library");

		return { success: true };
	} catch (error) {
		console.error("Failed to add to library:", error);
		return { error: "Failed to add to library" };
	}
}

export async function removeFromLibrary(novelId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		await prisma.libraryEntry.delete({
			where: {
				userId_novelId: {
					userId: session.user.id,
					novelId,
				},
			},
		});

		revalidatePath(`/novels/[slug]`, "page");
		revalidatePath("/dashboard");
		revalidatePath("/dashboard/library");

		return { success: true };
	} catch (error) {
		console.error("Failed to remove from library:", error);
		return { error: "Failed to remove from library" };
	}
}

export async function updateReadingProgress(
	novelId: string,
	chapterId: string
) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		// Upsert library entry with reading progress
		await prisma.libraryEntry.upsert({
			where: {
				userId_novelId: {
					userId: session.user.id,
					novelId,
				},
			},
			update: {
				lastReadChapterId: chapterId,
				updatedAt: new Date(),
			},
			create: {
				userId: session.user.id,
				novelId,
				lastReadChapterId: chapterId,
			},
		});

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/library");

		return { success: true };
	} catch (error) {
		console.error("Failed to update reading progress:", error);
		return { error: "Failed to update progress" };
	}
}

export async function getLibraryStatus(novelId: string) {
	const session = await getServerSession();

	if (!session) {
		return { inLibrary: false };
	}

	const entry = await prisma.libraryEntry.findUnique({
		where: {
			userId_novelId: {
				userId: session.user.id,
				novelId,
			},
		},
	});

	return { inLibrary: !!entry };
}
