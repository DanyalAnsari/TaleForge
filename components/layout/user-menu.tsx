"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, PenTool, Shield, LogOut, Library } from "lucide-react";
import Link from "next/link";

interface UserMenuProps {
	user: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
		role: "READER" | "AUTHOR" | "ADMIN";
	};
}

export function UserMenu({ user }: UserMenuProps) {
	const router = useRouter();

	async function handleSignOut() {
		await signOut();
		router.push("/");
		router.refresh();
	}

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10">
						<AvatarImage src={user.image || undefined} alt={user.name} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
						<p className="text-xs leading-none text-muted-foreground capitalize">
							{user.role.toLowerCase()}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href="/dashboard" className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						Dashboard
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href="/dashboard/library" className="cursor-pointer">
						<Library className="mr-2 h-4 w-4" />
						My Library
					</Link>
				</DropdownMenuItem>

				{(user.role === "AUTHOR" || user.role === "ADMIN") && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/author/novels" className="cursor-pointer">
								<PenTool className="mr-2 h-4 w-4" />
								My Novels
							</Link>
						</DropdownMenuItem>
					</>
				)}

				{user.role === "ADMIN" && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/admin" className="cursor-pointer">
								<Shield className="mr-2 h-4 w-4" />
								Admin Panel
							</Link>
						</DropdownMenuItem>
					</>
				)}

				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleSignOut}
					className="cursor-pointer text-destructive focus:text-destructive"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
