"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setRedirectUrl } from "@/lib/auth-redirect";

interface AuthRedirectHandlerProps {
	saveCurrentUrl?: boolean;
}

export function AuthRedirectHandler({
	saveCurrentUrl = true,
}: AuthRedirectHandlerProps) {
	const pathname = usePathname();

	useEffect(() => {
		if (saveCurrentUrl && pathname) {
			setRedirectUrl(pathname);
		}
	}, [pathname, saveCurrentUrl]);

	return null;
}
