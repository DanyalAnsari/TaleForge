import type { Metadata, Viewport } from "next";
import { Lora, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./forge-layout.css";
import { Navbar } from "@/components/layout/navbar";
import { constructMetadata } from "@/lib/metadata";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const lora = Lora({
	variable: "--font-lora",
	subsets: ["latin"],
	display: "swap",
});

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#faf6f1" },
		{ media: "(prefers-color-scheme: dark)", color: "#0f1729" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Preconnect to Google Fonts for faster font loading */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
			</head>
			<body
				className={`
					${lora.variable}
					${playfair.variable}
					${jetbrainsMono.variable}
					font-sans
					antialiased
					bg-background
					text-foreground
					selection:bg-forge-gold-muted
					selection:text-foreground
				`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TooltipProvider>
						{/* 
						Skip-to-content link for keyboard/screen-reader users.
						Visually hidden until focused.
					*/}
						<a
							href="#main-content"
							className="
							sr-only focus:not-sr-only
							focus:fixed focus:top-2 focus:left-2 focus:z-9999
							forge-btn-primary forge-focus-ring
							px-4 py-2 text-sm
						"
						>
							Skip to content
						</a>

						<div className="relative flex min-h-dvh flex-col">
							<Navbar />

							<main id="main-content" className="flex-1 w-full">
								{children}
							</main>

							<Footer />
						</div>

						<Toaster
							position="bottom-right"
							richColors
							toastOptions={{
								className:
									"forge-card border-[var(--border)] font-[var(--font-sans)] text-sm",
							}}
						/>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
