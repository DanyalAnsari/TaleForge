"use client";

import { useState, useEffect, useCallback } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Settings, Type, Sun, Moon, Minus, Plus } from "lucide-react";

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
		getStoredValue("reader-font-size", 18),
	);
	const [lineHeight, setLineHeight] = useState<number>(() =>
		getStoredValue("reader-line-height", 1.8),
	);
	const [theme, setTheme] = useState<Theme>(() =>
		getStoredValue<Theme>("reader-theme", "light"),
	);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		document.documentElement.style.setProperty(
			"--reader-font-size",
			`${fontSize}px`,
		);
		localStorage.setItem("reader-font-size", String(fontSize));
	}, [fontSize, mounted]);

	useEffect(() => {
		if (!mounted) return;

		document.documentElement.style.setProperty(
			"--reader-line-height",
			String(lineHeight),
		);
		localStorage.setItem("reader-line-height", String(lineHeight));
	}, [lineHeight, mounted]);

	useEffect(() => {
		if (!mounted) return;

		localStorage.setItem("reader-theme", theme);

		const readerContent = document.getElementById("reader-content");
		if (readerContent) {
			readerContent.classList.remove(
				"reader-theme-light",
				"reader-theme-dark",
				"reader-theme-sepia",
			);
			readerContent.classList.add(`reader-theme-${theme}`);
		}
	}, [theme, mounted]);

	const incrementFontSize = useCallback(() => {
		setFontSize((prev) => Math.min(prev + 1, 24));
	}, []);

	const decrementFontSize = useCallback(() => {
		setFontSize((prev) => Math.max(prev - 1, 14));
	}, []);

	const incrementLineHeight = useCallback(() => {
		setLineHeight((prev) => Math.min(+(prev + 0.1).toFixed(1), 2.4));
	}, []);

	const decrementLineHeight = useCallback(() => {
		setLineHeight((prev) => Math.max(+(prev - 0.1).toFixed(1), 1.4));
	}, []);

	const handleThemeChange = useCallback((newTheme: Theme) => {
		setTheme(newTheme);
	}, []);

	if (!mounted) {
		return (
			<button className="forge-btn-ghost forge-focus-ring p-2 transition-colors duration-(--duration-fast)">
				<Settings className="h-4 w-4" strokeWidth={1.75} />
			</button>
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="forge-btn-ghost forge-focus-ring p-2 transition-colors duration-(--duration-fast)">
					<Settings className="h-4 w-4" strokeWidth={1.75} />
				</button>
			</PopoverTrigger>
			<PopoverContent className="forge-popover p-5 w-80" align="end">
				<div className="space-y-6">
					{/* Font Size */}
					<div>
						<label className="font-(--font-mono) text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
							<Type className="h-3.5 w-3.5" />
							Font Size
						</label>
						<div className="flex items-center justify-between mt-2">
							<button
								onClick={decrementFontSize}
								disabled={fontSize <= 14}
								className="forge-btn-ghost forge-focus-ring p-1.5 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-[var(--duration-fast)]"
								aria-label="Decrease font size"
							>
								<Minus className="h-3.5 w-3.5" />
							</button>
							<span className="font-[var(--font-mono)] text-sm text-foreground tabular-nums">
								{fontSize}px
							</span>
							<button
								onClick={incrementFontSize}
								disabled={fontSize >= 24}
								className="forge-btn-ghost forge-focus-ring p-1.5 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-[var(--duration-fast)]"
								aria-label="Increase font size"
							>
								<Plus className="h-3.5 w-3.5" />
							</button>
						</div>
					</div>

					{/* Line Height */}
					<div>
						<label className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2 block">
							Line Height
						</label>
						<div className="flex items-center justify-between mt-2">
							<button
								onClick={decrementLineHeight}
								disabled={lineHeight <= 1.4}
								className="forge-btn-ghost forge-focus-ring p-1.5 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-[var(--duration-fast)]"
								aria-label="Decrease line height"
							>
								<Minus className="h-3.5 w-3.5" />
							</button>
							<span className="font-[var(--font-mono)] text-sm text-foreground tabular-nums">
								{lineHeight.toFixed(1)}
							</span>
							<button
								onClick={incrementLineHeight}
								disabled={lineHeight >= 2.4}
								className="forge-btn-ghost forge-focus-ring p-1.5 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-[var(--duration-fast)]"
								aria-label="Increase line height"
							>
								<Plus className="h-3.5 w-3.5" />
							</button>
						</div>
					</div>

					{/* Theme */}
					<div>
						<label className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2 block">
							Reading Theme
						</label>
						<div className="grid grid-cols-2 gap-2 mt-2">
							<button
								onClick={() => handleThemeChange("light")}
								className={`forge-btn-ghost forge-focus-ring py-2 px-3 text-xs inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] ${
									theme === "light" ?
										"ring-2 ring-[var(--forge-gold)] ring-offset-1 ring-offset-[var(--background)]"
									:	""
								}`}
							>
								<Sun className="h-3.5 w-3.5" />
								Light
							</button>
							<button
								onClick={() => handleThemeChange("dark")}
								className={`forge-btn-ghost forge-focus-ring py-2 px-3 text-xs inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] ${
									theme === "dark" ?
										"ring-2 ring-[var(--forge-gold)] ring-offset-1 ring-offset-[var(--background)]"
									:	""
								}`}
							>
								<Moon className="h-3.5 w-3.5" />
								Dark
							</button>
							<button
								onClick={() => handleThemeChange("sepia")}
								className={`forge-btn-ghost forge-focus-ring py-2 px-3 text-xs col-span-2 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] ${
									theme === "sepia" ?
										"ring-2 ring-[var(--forge-gold)] ring-offset-1 ring-offset-[var(--background)]"
									:	""
								}`}
							>
								<span
									className="h-3.5 w-3.5 rounded-full bg-[#f4ecd8] border border-[var(--border)] shrink-0"
									aria-hidden="true"
								/>
								Sepia
							</button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

