import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Like, User } from "@shared/schema";

interface LikeWithUsers extends Like {
  fromUser: User;
  toUser: User;
}

export default function AdminLikes() {
  const { data: likes = [], isLoading } = useQuery<LikeWithUsers[]>({
    queryKey: ["/api/admin/likes"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Likes</h1>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From User</TableHead>
                  <TableHead></TableHead>
                  <TableHead>To User</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {likes.map((like) => (
                  <TableRow key={like.id} data-testid={`row-like-${like.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={like.fromUser.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {like.fromUser.firstName?.[0]}{like.fromUser.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {like.fromUser.firstName} {like.fromUser.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {like.fromUser.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <ArrowRight className="w-5 h-5 text-primary mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={like.toUser.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {like.toUser.firstName?.[0]}{like.toUser.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {like.toUser.firstName} {like.toUser.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {like.toUser.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(like.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {likes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No likes yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
