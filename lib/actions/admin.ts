"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

async function requireAdmin() {
	const session = await getServerSession();
	if (!session) {
		throw new Error("Not authenticated");
	}
	const userRole = session.user.role;
	if (userRole !== "ADMIN") {
		throw new Error("Not authorized");
	}
	return session;
}

// User Management
export async function updateUserRole(
	userId: string,
	role: "READER" | "AUTHOR" | "ADMIN"
) {
	try {
		await requireAdmin();

		await prisma.user.update({
			where: { id: userId },
			data: { role },
		});

		revalidatePath("/admin/users");
		return { success: true };
	} catch (error) {
		console.error("Failed to update user role:", error);
		return { error: "Failed to update user role" };
	}
}

export async function toggleUserStatus(userId: string) {
	try {
		const session = await requireAdmin();

		// Prevent deactivating self
		if (userId === session.user.id) {
			return { error: "You cannot deactivate your own account" };
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { isActive: true },
		});

		if (!user) {
			return { error: "User not found" };
		}

		await prisma.user.update({
			where: { id: userId },
			data: { isActive: !user.isActive },
		});

		revalidatePath("/admin/users");
		return { success: true, isActive: !user.isActive };
	} catch (error) {
		console.error("Failed to toggle user status:", error);
		return { error: "Failed to update user status" };
	}
}

export async function deleteUser(userId: string) {
	try {
		const session = await requireAdmin();

		if (userId === session.user.id) {
			return { error: "You cannot delete your own account" };
		}

		await prisma.user.delete({
			where: { id: userId },
		});

		revalidatePath("/admin/users");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete user:", error);
		return { error: "Failed to delete user" };
	}
}

// Novel Management
export async function toggleNovelVisibility(novelId: string) {
	try {
		await requireAdmin();

		const novel = await prisma.novel.findUnique({
			where: { id: novelId },
			select: { isVisible: true },
		});

		if (!novel) {
			return { error: "Novel not found" };
		}

		await prisma.novel.update({
			where: { id: novelId },
			data: { isVisible: !novel.isVisible },
		});

		revalidatePath("/admin/novels");
		revalidatePath("/novels");
		return { success: true, isVisible: !novel.isVisible };
	} catch (error) {
		console.error("Failed to toggle novel visibility:", error);
		return { error: "Failed to update novel" };
	}
}

export async function deleteNovelAdmin(novelId: string) {
	try {
		await requireAdmin();

		await prisma.novel.delete({
			where: { id: novelId },
		});

		revalidatePath("/admin/novels");
		revalidatePath("/novels");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete novel:", error);
		return { error: "Failed to delete novel" };
	}
}

// Tag Management
export async function createTag(name: string) {
	try {
		await requireAdmin();

		const slug = name
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-");

		const existing = await prisma.tag.findUnique({
			where: { slug },
		});

		if (existing) {
			return { error: "Tag already exists" };
		}

		const tag = await prisma.tag.create({
			data: { name, slug },
		});

		revalidatePath("/admin/tags");
		return { success: true, tag };
	} catch (error) {
		console.error("Failed to create tag:", error);
		return { error: "Failed to create tag" };
	}
}

export async function updateTag(tagId: string, name: string) {
	try {
		await requireAdmin();

		const slug = name
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-");

		const existing = await prisma.tag.findFirst({
			where: { slug, id: { not: tagId } },
		});

		if (existing) {
			return { error: "Tag with this name already exists" };
		}

		await prisma.tag.update({
			where: { id: tagId },
			data: { name, slug },
		});

		revalidatePath("/admin/tags");
		return { success: true };
	} catch (error) {
		console.error("Failed to update tag:", error);
		return { error: "Failed to update tag" };
	}
}

export async function deleteTag(tagId: string) {
	try {
		await requireAdmin();

		await prisma.tag.delete({
			where: { id: tagId },
		});

		revalidatePath("/admin/tags");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete tag:", error);
		return { error: "Failed to delete tag" };
	}
}
