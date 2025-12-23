import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	action?: {
		label: string;
		href: string;
	};
	className?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-16 text-center",
				className
			)}
		>
			<Icon className="h-16 w-16 text-muted-foreground mb-4" />
			<h2 className="text-xl font-semibold mb-2">{title}</h2>
			<p className="text-muted-foreground max-w-md mb-6">{description}</p>
			{action && (
				<Button asChild>
					<Link href={action.href}>{action.label}</Link>
				</Button>
			)}
		</div>
	);
}
