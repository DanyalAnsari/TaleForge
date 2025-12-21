"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Settings, Type, Sun, Moon } from "lucide-react";

type Theme = "light" | "dark" | "sepia";

function getStoredValue<T>(key: string, defaultValue: T): T {
	if (typeof window === "undefined") return defaultValue;

	const stored = localStorage.getItem(key);
	if (stored === null) return defaultValue;

	if (typeof defaultValue === "number") {
		return Number(stored) as T;
	}
	return stored as T;
}

export function ReaderSettings() {
	const [fontSize, setFontSize] = useState<number>(() =>
		getStoredValue("reader-font-size", 18)
	);
	const [lineHeight, setLineHeight] = useState<number>(() =>
		getStoredValue("reader-line-height", 1.8)
	);
	const [theme, setTheme] = useState<Theme>(() =>
		getStoredValue<Theme>("reader-theme", "light")
	);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		document.documentElement.style.setProperty(
			"--reader-font-size",
			`${fontSize}px`
		);
		localStorage.setItem("reader-font-size", String(fontSize));
	}, [fontSize, mounted]);

	useEffect(() => {
		if (!mounted) return;

		document.documentElement.style.setProperty(
			"--reader-line-height",
			String(lineHeight)
		);
		localStorage.setItem("reader-line-height", String(lineHeight));
	}, [lineHeight, mounted]);

	useEffect(() => {
		if (!mounted) return;

		localStorage.setItem("reader-theme", theme);

		const readerContent = document.getElementById("reader-content");
		if (readerContent) {
			// Remove all theme classes
			readerContent.classList.remove(
				"reader-theme-light",
				"reader-theme-dark",
				"reader-theme-sepia"
			);
			// Add the current theme class
			readerContent.classList.add(`reader-theme-${theme}`);
		}
	}, [theme, mounted]);

	const handleFontSizeChange = useCallback((value: number[]) => {
		setFontSize(value[0]);
	}, []);

	const handleLineHeightChange = useCallback((value: number[]) => {
		setLineHeight(value[0]);
	}, []);

	const handleThemeChange = useCallback((newTheme: Theme) => {
		setTheme(newTheme);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon">
				<Settings className="h-5 w-5" />
			</Button>
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings className="h-5 w-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="end">
				<div className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium flex items-center gap-2">
								<Type className="h-4 w-4" />
								Font Size
							</label>
							<span className="text-sm text-muted-foreground">
								{fontSize}px
							</span>
						</div>
						<Slider
							value={[fontSize]}
							onValueChange={handleFontSizeChange}
							min={14}
							max={24}
							step={1}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium">Line Height</label>
							<span className="text-sm text-muted-foreground">
								{lineHeight.toFixed(1)}
							</span>
						</div>
						<Slider
							value={[lineHeight]}
							onValueChange={handleLineHeightChange}
							min={1.4}
							max={2.4}
							step={0.1}
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Theme</label>
						<div className="flex gap-2">
							<Button
								variant={theme === "light" ? "default" : "outline"}
								size="sm"
								onClick={() => handleThemeChange("light")}
								className="flex-1"
							>
								<Sun className="h-4 w-4 mr-1" />
								Light
							</Button>
							<Button
								variant={theme === "dark" ? "default" : "outline"}
								size="sm"
								onClick={() => handleThemeChange("dark")}
								className="flex-1"
							>
								<Moon className="h-4 w-4 mr-1" />
								Dark
							</Button>
							<Button
								variant={theme === "sepia" ? "default" : "outline"}
								size="sm"
								onClick={() => handleThemeChange("sepia")}
								className="flex-1"
							>
								Sepia
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
