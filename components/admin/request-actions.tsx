"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import {
	approveAuthorRequest,
	rejectAuthorRequest,
} from "@/lib/actions/author-request";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RequestActionsProps {
	requestId: string;
	userName: string;
}

export function RequestActions({ requestId, userName }: RequestActionsProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showApproveDialog, setShowApproveDialog] = useState(false);
	const [showRejectDialog, setShowRejectDialog] = useState(false);

	function handleApprove() {
		startTransition(async () => {
			const result = await approveAuthorRequest(requestId);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(`${userName} is now an author`);
				setShowApproveDialog(false);
				router.refresh();
			}
		});
	}

	function handleReject() {
		startTransition(async () => {
			const result = await rejectAuthorRequest(requestId);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Request rejected");
				setShowRejectDialog(false);
				router.refresh();
			}
		});
	}

	return (
		<>
			<div className="flex items-center gap-2">
				<Button
					size="sm"
					onClick={() => setShowApproveDialog(true)}
					disabled={isPending}
				>
					{isPending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<Check className="mr-1 h-4 w-4" />
							Approve
						</>
					)}
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => setShowRejectDialog(true)}
					disabled={isPending}
				>
					<X className="mr-1 h-4 w-4" />
					Reject
				</Button>
			</div>

			{/* Approve Dialog */}
			<AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Approve Author Request</AlertDialogTitle>
						<AlertDialogDescription>
							This will grant <strong>{userName}</strong> author privileges.
							They will be able to create and publish novels.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleApprove} disabled={isPending}>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Approve"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Reject Dialog */}
			<AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Reject Author Request</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to reject the request from{" "}
							<strong>{userName}</strong>? They will be able to submit a new
							request later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleReject}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Reject"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
