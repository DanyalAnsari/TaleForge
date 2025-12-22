"use client";

import { useEffect, useRef } from "react";
import { incrementChapterViews } from "@/lib/actions/views";

interface ViewTrackerProps {
	chapterId: string;
}

export function ViewTracker({ chapterId }: ViewTrackerProps) {
	const hasTracked = useRef(false);

	useEffect(() => {
		if (hasTracked.current) return;

		// Track view after a short delay to ensure it's a real view
		const timer = setTimeout(() => {
			incrementChapterViews(chapterId);
			hasTracked.current = true;
		}, 3000); // 3 seconds

		return () => clearTimeout(timer);
	}, [chapterId]);

	return null;
}
