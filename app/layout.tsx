import type { Metadata, Viewport } from "next";
import { Lora, Playfair, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { constructMetadata } from "@/lib/metadata";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";

const loraSans = Lora({
	variable: "--font-lora",
	subsets: ["latin"],
});

const playfair = Playfair({
	variable: "--font-playfair",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
});

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${loraSans.variable} ${playfair.variable}
				 ${jetbrainsMono.variable}  font-sans antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="relative min-h-screen flex flex-col">
						<Navbar />
						<main className="w-full flex-1">{children}</main>
						<Footer />
					</div>
					<Toaster position="bottom-right" richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
