"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTag } from "@/lib/actions/admin";
import { Loader2, Plus } from "lucide-react";

export function TagForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await createTag(name.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setName("");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Enter tag name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
        />
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
      <Button type="submit" disabled={isPending || !name.trim()}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </>
        )}
      </Button>
    </form>
  );
}