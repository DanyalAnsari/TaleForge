"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Strikethrough,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Minus,
	Pilcrow,
	RemoveFormatting,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	content?: string;
	onChange?: (html: string) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}

export function RichTextEditor({
	content = "",
	onChange,
	disabled = false,
	placeholder = "Write your chapter content here...",
	className,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Placeholder.configure({
				placeholder,
			}),
			CharacterCount,
		],
		content,
		editable: !disabled,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[500px] px-5 py-4 focus:outline-none",
			},
		},
		// Suppress SSR hydration warning
		immediatelyRender: false,
	});

	if (!editor) {
		return (
			<div
				className={cn(
					"rounded-md border bg-muted/30 min-h-125 animate-pulse",
					className,
				)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"rounded-md border border-input bg-background",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
		>
			<EditorToolbar editor={editor} disabled={disabled} />
			<EditorContent editor={editor} />
			<EditorFooter editor={editor} />
		</div>
	);
}

// --- Toolbar ---

interface EditorToolbarProps {
	editor: Editor;
	disabled: boolean;
}

function EditorToolbar({ editor, disabled }: EditorToolbarProps) {
	return (
		<TooltipProvider delayDuration={300}>
			<div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5 bg-muted/30">
				{/* Undo / Redo */}
				<ToolbarButton
					tooltip="Undo"
					icon={<Undo className="h-4 w-4" />}
					onClick={() => editor.chain().focus().undo().run()}
					disabled={disabled || !editor.can().undo()}
				/>
				<ToolbarButton
					tooltip="Redo"
					icon={<Redo className="h-4 w-4" />}
					onClick={() => editor.chain().focus().redo().run()}
					disabled={disabled || !editor.can().redo()}
				/>

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Block Type */}
				<ToolbarButton
					tooltip="Paragraph"
					icon={<Pilcrow className="h-4 w-4" />}
					onClick={() => editor.chain().focus().setParagraph().run()}
					isActive={editor.isActive("paragraph")}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Heading 1"
					icon={<Heading1 className="h-4 w-4" />}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					isActive={editor.isActive("heading", { level: 1 })}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Heading 2"
					icon={<Heading2 className="h-4 w-4" />}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					isActive={editor.isActive("heading", { level: 2 })}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Heading 3"
					icon={<Heading3 className="h-4 w-4" />}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					isActive={editor.isActive("heading", { level: 3 })}
					disabled={disabled}
				/>

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Inline Formatting */}
				<ToolbarButton
					tooltip="Bold (Ctrl+B)"
					icon={<Bold className="h-4 w-4" />}
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Italic (Ctrl+I)"
					icon={<Italic className="h-4 w-4" />}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Underline (Ctrl+U)"
					icon={<UnderlineIcon className="h-4 w-4" />}
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					isActive={editor.isActive("underline")}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Strikethrough"
					icon={<Strikethrough className="h-4 w-4" />}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive("strike")}
					disabled={disabled}
				/>

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Text Alignment */}
				<ToolbarButton
					tooltip="Align Left"
					icon={<AlignLeft className="h-4 w-4" />}
					onClick={() => editor.chain().focus().setTextAlign("left").run()}
					isActive={editor.isActive({ textAlign: "left" })}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Align Center"
					icon={<AlignCenter className="h-4 w-4" />}
					onClick={() => editor.chain().focus().setTextAlign("center").run()}
					isActive={editor.isActive({ textAlign: "center" })}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Align Right"
					icon={<AlignRight className="h-4 w-4" />}
					onClick={() => editor.chain().focus().setTextAlign("right").run()}
					isActive={editor.isActive({ textAlign: "right" })}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Justify"
					icon={<AlignJustify className="h-4 w-4" />}
					onClick={() => editor.chain().focus().setTextAlign("justify").run()}
					isActive={editor.isActive({ textAlign: "justify" })}
					disabled={disabled}
				/>

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Lists & Block Elements */}
				<ToolbarButton
					tooltip="Bullet List"
					icon={<List className="h-4 w-4" />}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					isActive={editor.isActive("bulletList")}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Ordered List"
					icon={<ListOrdered className="h-4 w-4" />}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					isActive={editor.isActive("orderedList")}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Blockquote"
					icon={<Quote className="h-4 w-4" />}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive("blockquote")}
					disabled={disabled}
				/>
				<ToolbarButton
					tooltip="Horizontal Rule"
					icon={<Minus className="h-4 w-4" />}
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
					disabled={disabled}
				/>

				<Separator orientation="vertical" className="mx-1 h-6" />

				{/* Clear Formatting */}
				<ToolbarButton
					tooltip="Clear Formatting"
					icon={<RemoveFormatting className="h-4 w-4" />}
					onClick={() =>
						editor.chain().focus().clearNodes().unsetAllMarks().run()
					}
					disabled={disabled}
				/>
			</div>
		</TooltipProvider>
	);
}

// --- Single Toolbar Button ---

interface ToolbarButtonProps {
	tooltip: string;
	icon: React.ReactNode;
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
}

function ToolbarButton({
	tooltip,
	icon,
	onClick,
	isActive = false,
	disabled = false,
}: ToolbarButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Toggle
					size="sm"
					pressed={isActive}
					onPressedChange={() => onClick()}
					disabled={disabled}
					className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
				>
					{icon}
				</Toggle>
			</TooltipTrigger>
			<TooltipContent side="bottom" className="text-xs">
				{tooltip}
			</TooltipContent>
		</Tooltip>
	);
}

// --- Footer with word/character count ---

function EditorFooter({ editor }: { editor: Editor }) {
	const chars = editor.storage.characterCount.characters();
	const words = editor.storage.characterCount.words();

	return (
		<div className="flex items-center justify-end gap-3 border-t px-3 py-1.5 text-xs text-muted-foreground bg-muted/30">
			<span>{words.toLocaleString()} words</span>
			<span>{chars.toLocaleString()} characters</span>
		</div>
	);
}
