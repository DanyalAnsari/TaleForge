"use client";

import { useEffect } from "react";
import { setRedirectUrl } from "@/lib/auth-redirect";

interface RedirectSaverProps {
	url: string;
}

export function RedirectSaver({ url }: RedirectSaverProps) {
	useEffect(() => {
		if (url) {
			setRedirectUrl(url);
		}
	}, [url]);

	return null;
}
