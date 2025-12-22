"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  toggleNovelVisibility,
  deleteNovelAdmin,
} from "@/lib/actions/admin";
import {
  MoreHorizontal,
  Eye,
  EyeOff,
  ExternalLink,
  Trash2,
  Loader2,
} from "lucide-react";

interface NovelActionsProps {
  novelId: string;
  novelTitle: string;
  novelSlug: string;
  isVisible: boolean;
}

export function NovelActions({
  novelId,
  novelTitle,
  novelSlug,
  isVisible,
}: NovelActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [visible, setVisible] = useState(isVisible);

  function handleToggleVisibility() {
    startTransition(async () => {
      const result = await toggleNovelVisibility(novelId);
      if (result.success && typeof result.isVisible === "boolean") {
        setVisible(result.isVisible);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteNovelAdmin(novelId);
      if (result.success) {
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
          <DropdownMenuItem asChild>
            <Link href={`/novels/${novelSlug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Page
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleVisibility}>
            {visible ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Novel
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Novel
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Novel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Novel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{novelTitle}</strong>?
              This will also delete all chapters. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
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
                "Delete Novel"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}