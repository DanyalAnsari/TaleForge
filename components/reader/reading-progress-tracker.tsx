"use client";

import { useEffect, useRef } from "react";
import { updateReadingProgress } from "@/lib/actions/library";

interface ReadingProgressTrackerProps {
	novelId: string;
	chapterId: string;
	isLoggedIn: boolean;
}

export function ReadingProgressTracker({
	novelId,
	chapterId,
	isLoggedIn,
}: ReadingProgressTrackerProps) {
	const hasTracked = useRef(false);

	useEffect(() => {
		if (!isLoggedIn || hasTracked.current) return;

		// Track progress after a short delay (user has started reading)
		const timer = setTimeout(() => {
			updateReadingProgress(novelId, chapterId);
			hasTracked.current = true;
		}, 5000); // 5 seconds

		return () => clearTimeout(timer);
	}, [novelId, chapterId, isLoggedIn]);

	return null;
}
