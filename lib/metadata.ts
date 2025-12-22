// lib/metadata.ts

import { Metadata } from "next";

const siteConfig = {
	name: "WebNovel",
	description:
		"Discover and read thousands of web novels. From fantasy epics to slice-of-life stories, find your next adventure on WebNovel.",
	url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	ogImage: "/og-image.jpg",
	creator: "WebNovel Team",
};

export function constructMetadata({
	title,
	description,
	image,
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	noIndex?: boolean;
} = {}): Metadata {
	return {
		title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
		description: description || siteConfig.description,
		openGraph: {
			title: title || siteConfig.name,
			description: description || siteConfig.description,
			url: siteConfig.url,
			siteName: siteConfig.name,
			images: [
				{
					url: image || siteConfig.ogImage,
					width: 1200,
					height: 630,
					alt: title || siteConfig.name,
				},
			],
			locale: "en_US",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: title || siteConfig.name,
			description: description || siteConfig.description,
			images: [image || siteConfig.ogImage],
			creator: `@${siteConfig.creator}`,
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		icons: {
			icon: "/favicon.ico",
			shortcut: "/favicon-16x16.png",
			apple: "/apple-touch-icon.png",
		},
		manifest: "/site.webmanifest",
	};
}

export { siteConfig };
