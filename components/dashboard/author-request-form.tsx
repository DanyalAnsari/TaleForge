"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { submitAuthorRequest } from "@/lib/actions/author-request";
import { PenTool, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface AuthorRequestFormProps {
	existingRequest?: {
		id: string;
		reason: string;
		status: "PENDING" | "APPROVED" | "REJECTED";
		createdAt: Date;
	} | null;
}

export function AuthorRequestForm({ existingRequest }: AuthorRequestFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [reason, setReason] = useState("");
	const [showForm, setShowForm] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		startTransition(async () => {
			const result = await submitAuthorRequest(reason);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(
					result.resubmitted
						? "Request resubmitted successfully"
						: "Request submitted successfully"
				);
				setReason("");
				setShowForm(false);
				router.refresh();
			}
		});
	}

	// Show existing request status
	if (existingRequest) {
		const statusConfig = {
			PENDING: {
				icon: Clock,
				label: "Pending Review",
				color: "bg-yellow-100 text-yellow-700",
				description: "Your request is being reviewed by our team.",
			},
			APPROVED: {
				icon: CheckCircle,
				label: "Approved",
				color: "bg-green-100 text-green-700",
				description: "Congratulations! You are now an author.",
			},
			REJECTED: {
				icon: XCircle,
				label: "Rejected",
				color: "bg-red-100 text-red-700",
				description:
					"Your request was not approved. You can submit a new request.",
			},
		};

		const config = statusConfig[existingRequest.status];
		const StatusIcon = config.icon;

		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<PenTool className="h-5 w-5" />
						Author Request
					</CardTitle>
					<CardDescription>Your request to become an author</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-full ${config.color}`}>
							<StatusIcon className="h-5 w-5" />
						</div>
						<div>
							<Badge className={config.color}>{config.label}</Badge>
							<p className="text-sm text-muted-foreground mt-1">
								{config.description}
							</p>
						</div>
					</div>

					<div className="bg-muted/50 p-4 rounded-lg">
						<p className="text-sm font-medium mb-1">Your reason:</p>
						<p className="text-sm text-muted-foreground">
							{existingRequest.reason}
						</p>
					</div>

					{existingRequest.status === "REJECTED" && !showForm && (
						<Button onClick={() => setShowForm(true)}>
							Submit New Request
						</Button>
					)}

					{existingRequest.status === "REJECTED" && showForm && (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="reason">
									Why do you want to become an author?
								</Label>
								<Textarea
									id="reason"
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									placeholder="Tell us about your writing experience and what kind of stories you want to share..."
									rows={4}
									disabled={isPending}
								/>
								<p className="text-xs text-muted-foreground">
									{reason.length}/1000 characters (minimum 20)
								</p>
							</div>
							<div className="flex gap-2">
								<Button
									type="submit"
									disabled={isPending || reason.length < 20}
								>
									{isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Submitting...
										</>
									) : (
										"Resubmit Request"
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowForm(false)}
									disabled={isPending}
								>
									Cancel
								</Button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		);
	}

	// Show request form for new users
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<PenTool className="h-5 w-5" />
					Become an Author
				</CardTitle>
				<CardDescription>
					Request access to publish your own novels
				</CardDescription>
			</CardHeader>
			<CardContent>
				{!showForm ? (
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							As an author, you&apos;ll be able to:
						</p>
						<ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
							<li>Create and publish your own novels</li>
							<li>Write and manage chapters</li>
							<li>Track your novel&apos;s performance</li>
							<li>Receive feedback from readers</li>
						</ul>
						<Button onClick={() => setShowForm(true)}>
							<PenTool className="mr-2 h-4 w-4" />
							Request Author Access
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="reason">
								Why do you want to become an author?
							</Label>
							<Textarea
								id="reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="Tell us about your writing experience and what kind of stories you want to share..."
								rows={4}
								disabled={isPending}
							/>
							<p className="text-xs text-muted-foreground">
								{reason.length}/1000 characters (minimum 20)
							</p>
						</div>
						<div className="flex gap-2">
							<Button type="submit" disabled={isPending || reason.length < 20}>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									</>
								) : (
									"Submit Request"
								)}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowForm(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
