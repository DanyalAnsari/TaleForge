"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Simple in-memory rate limiting (in production, use Redis)
const viewedRecently = new Map<string, number>();
const VIEW_COOLDOWN = 60 * 1000; // 1 minute cooldown

function getViewKey(type: "novel" | "chapter", id: string, ip: string): string {
	return `${type}:${id}:${ip}`;
}

function canRecordView(key: string): boolean {
	const lastView = viewedRecently.get(key);
	if (!lastView) return true;
	return Date.now() - lastView > VIEW_COOLDOWN;
}

function recordViewTime(key: string): void {
	viewedRecently.set(key, Date.now());

	// Clean up old entries periodically
	if (viewedRecently.size > 10000) {
		const now = Date.now();
		for (const [k, v] of viewedRecently.entries()) {
			if (now - v > VIEW_COOLDOWN * 2) {
				viewedRecently.delete(k);
			}
		}
	}
}

export async function incrementNovelViews(novelId: string) {
	try {
		const headersList = await headers();
		const ip = headersList.get("x-forwarded-for") || "unknown";
		const key = getViewKey("novel", novelId, ip);

		if (!canRecordView(key)) {
			return { success: false, reason: "rate-limited" };
		}

		await prisma.novel.update({
			where: { id: novelId },
			data: { views: { increment: 1 } },
		});

		recordViewTime(key);
		return { success: true };
	} catch (error) {
		console.error("Failed to increment novel views:", error);
		return { success: false, reason: "error" };
	}
}

export async function incrementChapterViews(chapterId: string) {
	try {
		const headersList = await headers();
		const ip = headersList.get("x-forwarded-for") || "unknown";
		const key = getViewKey("chapter", chapterId, ip);

		if (!canRecordView(key)) {
			return { success: false, reason: "rate-limited" };
		}

		await prisma.chapter.update({
			where: { id: chapterId },
			data: { views: { increment: 1 } },
		});

		recordViewTime(key);
		return { success: true };
	} catch (error) {
		console.error("Failed to increment chapter views:", error);
		return { success: false, reason: "error" };
	}
}
