import  prisma  from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TagForm } from "@/components/admin/tag-form";
import { TagActions } from "@/components/admin/tag-actions";
import { Tag } from "lucide-react";

async function getTags() {
  return prisma.tag.findMany({
    include: {
      _count: {
        select: { novels: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="text-muted-foreground mt-1">
          Manage {tags.length} tags on the platform
        </p>
      </div>

      {/* Add Tag Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <TagForm />
        </CardContent>
      </Card>

      {/* Tags List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Novels</TableHead>
                  <TableHead className="w-25"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {tag.slug}
                    </TableCell>
                    <TableCell>{tag._count.novels}</TableCell>
                    <TableCell>
                      <TagActions
                        tagId={tag.id}
                        tagName={tag.name}
                        novelCount={tag._count.novels}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tags yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}