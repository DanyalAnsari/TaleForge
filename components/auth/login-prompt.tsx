"use client";

import Link from "next/link";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoginPromptProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	action?: string;
}

export function LoginPrompt({
	open,
	onOpenChange,
	action = "do this",
}: LoginPromptProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Login Required</AlertDialogTitle>
					<AlertDialogDescription>
						You need to be logged in to {action}. Create an account or login to
						continue.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Link href="/login">Login</Link>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
