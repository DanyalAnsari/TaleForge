"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

interface ReviewData {
	rating: number;
	title?: string;
	body: string;
}

export async function createReview(novelId: string, data: ReviewData) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in to write a review" };
	}

	if (data.rating < 1 || data.rating > 5) {
		return { error: "Rating must be between 1 and 5" };
	}

	if (!data.body.trim()) {
		return { error: "Review body cannot be empty" };
	}

	if (data.body.length > 5000) {
		return { error: "Review is too long (max 5000 characters)" };
	}

	try {
		const novel = await prisma.novel.findUnique({
			where: { id: novelId },
			select: { slug: true, authorId: true },
		});

		if (!novel) {
			return { error: "Novel not found" };
		}

		// Check if user is the author
		if (novel.authorId === session.user.id) {
			return { error: "You cannot review your own novel" };
		}

		// Check if user already reviewed
		const existingReview = await prisma.novelReview.findUnique({
			where: {
				novelId_userId: {
					novelId,
					userId: session.user.id,
				},
			},
		});

		if (existingReview) {
			return { error: "You have already reviewed this novel" };
		}

		await prisma.novelReview.create({
			data: {
				rating: data.rating,
				title: data.title?.trim() || null,
				body: data.body.trim(),
				novelId,
				userId: session.user.id,
			},
		});

		revalidatePath(`/novels/${novel.slug}`);

		return { success: true };
	} catch (error) {
		console.error("Failed to create review:", error);
		return { error: "Failed to submit review" };
	}
}

export async function updateReview(reviewId: string, data: ReviewData) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	if (data.rating < 1 || data.rating > 5) {
		return { error: "Rating must be between 1 and 5" };
	}

	if (!data.body.trim()) {
		return { error: "Review body cannot be empty" };
	}

	try {
		const review = await prisma.novelReview.findUnique({
			where: { id: reviewId },
			include: {
				novel: { select: { slug: true } },
			},
		});

		if (!review) {
			return { error: "Review not found" };
		}

		const userRole = session.user.role;
		if (review.userId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You can only edit your own review" };
		}

		await prisma.novelReview.update({
			where: { id: reviewId },
			data: {
				rating: data.rating,
				title: data.title?.trim() || null,
				body: data.body.trim(),
			},
		});

		revalidatePath(`/novels/${review.novel.slug}`);

		return { success: true };
	} catch (error) {
		console.error("Failed to update review:", error);
		return { error: "Failed to update review" };
	}
}

export async function deleteReview(reviewId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	try {
		const review = await prisma.novelReview.findUnique({
			where: { id: reviewId },
			include: {
				novel: { select: { slug: true } },
			},
		});

		if (!review) {
			return { error: "Review not found" };
		}

		const userRole = session.user.role;
		if (review.userId !== session.user.id && userRole !== "ADMIN") {
			return { error: "You can only delete your own review" };
		}

		await prisma.novelReview.delete({
			where: { id: reviewId },
		});

		revalidatePath(`/novels/${review.novel.slug}`);

		return { success: true };
	} catch (error) {
		console.error("Failed to delete review:", error);
		return { error: "Failed to delete review" };
	}
}
