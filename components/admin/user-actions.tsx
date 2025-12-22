"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from "@/lib/actions/admin";
import {
  MoreHorizontal,
  Shield,
  PenTool,
  User,
  UserCheck,
  UserX,
  Trash2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserActionsProps {
  userId: string;
  userName: string;
  currentRole: string;
  isActive: boolean;
  isCurrentUser: boolean;
}

export function UserActions({
  userId,
  userName,
  currentRole,
  isActive,
  isCurrentUser,
}: UserActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleRoleChange(role: "READER" | "AUTHOR" | "ADMIN") {
    setError(null);
    startTransition(async () => {
      const result = await updateUserRole(userId, role);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleToggleStatus() {
    setError(null);
    startTransition(async () => {
      const result = await toggleUserStatus(userId);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.error) {
        setError(result.error);
      } else {
        setShowDeleteDialog(false);
        router.refresh();
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => handleRoleChange("READER")}
                disabled={currentRole === "READER"}
              >
                <User className="mr-2 h-4 w-4" />
                Reader
                {currentRole === "READER" && " (current)"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("AUTHOR")}
                disabled={currentRole === "AUTHOR"}
              >
                <PenTool className="mr-2 h-4 w-4" />
                Author
                {currentRole === "AUTHOR" && " (current)"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("ADMIN")}
                disabled={currentRole === "ADMIN"}
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin
                {currentRole === "ADMIN" && " (current)"}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={handleToggleStatus}
            disabled={isCurrentUser}
          >
            {isActive ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isCurrentUser}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{userName}</strong>? This
              will also delete all their novels and chapters. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}