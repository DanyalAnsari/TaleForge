"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { slugify } from "@/lib/utils";

interface NovelFormData {
	title: string;
	description: string;
	coverImageUrl?: string;
	status: "ONGOING" | "COMPLETED" | "HIATUS";
	tagIds: string[];
}

export async function createNovel(data: NovelFormData) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	const userRole = session.user.role;
	if (userRole !== "AUTHOR" && userRole !== "ADMIN") {
		return { error: "You must be an author to create novels" };
	}

	try {
		// Generate unique slug
		let slug = slugify(data.title);
		const existingSlug = await prisma.novel.findUnique({
			where: { slug },
		});

		if (existingSlug) {
			slug = `${slug}-${Date.now()}`;
		}

		const novel = await prisma.novel.create({
			data: {
				title: data.title,
				slug,
				description: data.description,
				coverImageUrl: data.coverImageUrl || null,
				status: data.status,
				authorId: session.user.id,
				tags: {
					create: data.tagIds.map((tagId) => ({
						tagId,
					})),
				},
			},
		});

		revalidatePath("/author/novels");
		revalidatePath("/novels");

		return { success: true, novelId: novel.id };
	} catch (error) {
		console.error("Failed to create novel:", error);
		return { error: "Failed to create novel" };
	}
}

export async function updateNovel(novelId: string, data: NovelFormData) {
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
			return { error: "You don't have permission to edit this novel" };
		}

		// Update slug if title changed
		let slug = novel.slug;
		const newSlug = slugify(data.title);
		if (newSlug !== novel.slug) {
			const existingSlug = await prisma.novel.findFirst({
				where: { slug: newSlug, id: { not: novelId } },
			});
			slug = existingSlug ? `${newSlug}-${Date.now()}` : newSlug;
		}

		// Update novel and tags
		await prisma.$transaction([
			// Delete existing tags
			prisma.novelTag.deleteMany({
				where: { novelId },
			}),
			// Update novel
			prisma.novel.update({
				where: { id: novelId },
				data: {
					title: data.title,
					slug,
					description: data.description,
					coverImageUrl: data.coverImageUrl || null,
					status: data.status,
					tags: {
						create: data.tagIds.map((tagId) => ({
							tagId,
						})),
					},
				},
			}),
		]);

		revalidatePath("/author/novels");
		revalidatePath(`/author/novels/${novelId}`);
		revalidatePath(`/novels/${slug}`);
		revalidatePath("/novels");

		return { success: true };
	} catch (error) {
		console.error("Failed to update novel:", error);
		return { error: "Failed to update novel" };
	}
}

export async function deleteNovel(novelId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		const novel = await prisma.novel.findUnique({
			where: { id: novelId },
			select: { authorId: true },
		});

		if (!novel) {
			return { error: "Novel not found" };
		}

		const userRole = session.user.role;
		if (novel.authorId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You don't have permission to delete this novel" };
		}

		await prisma.novel.delete({
			where: { id: novelId },
		});

		revalidatePath("/author/novels");
		revalidatePath("/novels");

		return { success: true };
	} catch (error) {
		console.error("Failed to delete novel:", error);
		return { error: "Failed to delete novel" };
	}
}

export async function toggleNovelVisibility(novelId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		const novel = await prisma.novel.findUnique({
			where: { id: novelId },
			select: { authorId: true, isVisible: true },
		});

		if (!novel) {
			return { error: "Novel not found" };
		}

		const userRole = session.user.role;
		if (novel.authorId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You don't have permission" };
		}

		await prisma.novel.update({
			where: { id: novelId },
			data: { isVisible: !novel.isVisible },
		});

		revalidatePath("/author/novels");
		revalidatePath(`/author/novels/${novelId}`);
		revalidatePath("/novels");

		return { success: true, isVisible: !novel.isVisible };
	} catch (error) {
		console.error("Failed to toggle visibility:", error);
		return { error: "Failed to update visibility" };
	}
}
