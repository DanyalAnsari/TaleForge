"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

export async function submitAuthorRequest(reason: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	const userRole = session.user.role;
	if (userRole !== "READER") {
		return { error: "You are already an author or admin" };
	}

	if (!reason.trim()) {
		return { error: "Please provide a reason for your request" };
	}

	if (reason.length < 20) {
		return { error: "Please provide more detail (at least 20 characters)" };
	}

	if (reason.length > 1000) {
		return { error: "Reason is too long (max 1000 characters)" };
	}

	try {
		// Check for existing request
		const existing = await prisma.authorRequest.findUnique({
			where: { userId: session.user.id },
		});

		if (existing) {
			if (existing.status === "PENDING") {
				return { error: "You already have a pending request" };
			}
			if (existing.status === "REJECTED") {
				// Allow resubmission after rejection
				await prisma.authorRequest.update({
					where: { id: existing.id },
					data: {
						reason: reason.trim(),
						status: "PENDING",
						updatedAt: new Date(),
					},
				});
				revalidatePath("/dashboard/settings");
				return { success: true, resubmitted: true };
			}
		}

		await prisma.authorRequest.create({
			data: {
				userId: session.user.id,
				reason: reason.trim(),
			},
		});

		revalidatePath("/dashboard/settings");
		revalidatePath("/admin");

		return { success: true };
	} catch (error) {
		console.error("Failed to submit author request:", error);
		return { error: "Failed to submit request" };
	}
}

export async function approveAuthorRequest(requestId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	const userRole = session.user.role;
	if (userRole !== "ADMIN") {
		return { error: "Only admins can approve requests" };
	}

	try {
		const request = await prisma.authorRequest.findUnique({
			where: { id: requestId },
			include: { user: { select: { id: true, role: true } } },
		});

		if (!request) {
			return { error: "Request not found" };
		}

		if (request.status !== "PENDING") {
			return { error: "Request has already been processed" };
		}

		// Update request and user role in transaction
		await prisma.$transaction([
			prisma.authorRequest.update({
				where: { id: requestId },
				data: { status: "APPROVED" },
			}),
			prisma.user.update({
				where: { id: request.userId },
				data: { role: "AUTHOR" },
			}),
		]);

		revalidatePath("/admin");
		revalidatePath("/admin/requests");

		return { success: true };
	} catch (error) {
		console.error("Failed to approve request:", error);
		return { error: "Failed to approve request" };
	}
}

export async function rejectAuthorRequest(requestId: string) {
	const session = await getServerSession();

	if (!session) {
		return { error: "You must be logged in" };
	}

	const userRole = session.user.role;
	if (userRole !== "ADMIN") {
		return { error: "Only admins can reject requests" };
	}

	try {
		const request = await prisma.authorRequest.findUnique({
			where: { id: requestId },
		});

		if (!request) {
			return { error: "Request not found" };
		}

		if (request.status !== "PENDING") {
			return { error: "Request has already been processed" };
		}

		await prisma.authorRequest.update({
			where: { id: requestId },
			data: { status: "REJECTED" },
		});

		revalidatePath("/admin");
		revalidatePath("/admin/requests");

		return { success: true };
	} catch (error) {
		console.error("Failed to reject request:", error);
		return { error: "Failed to reject request" };
	}
}

export async function getUserAuthorRequest(userId: string) {
	return prisma.authorRequest.findUnique({
		where: { userId },
	});
}

export async function getPendingRequestsCount() {
	return prisma.authorRequest.count({
		where: { status: "PENDING" },
	});
}
