import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MatchWithUsers } from "@shared/schema";

export default function AdminMatches() {
  const { data: matches = [], isLoading } = useQuery<MatchWithUsers[]>({
    queryKey: ["/api/admin/matches"],
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
        <h1 className="text-3xl font-bold mb-8">All Matches</h1>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User 1</TableHead>
                  <TableHead></TableHead>
                  <TableHead>User 2</TableHead>
                  <TableHead>Matched On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id} data-testid={`row-match-${match.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={match.user1.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {match.user1.firstName?.[0]}{match.user1.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {match.user1.firstName} {match.user1.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {match.user1.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="gap-1">
                        <Heart className="w-3 h-3" />
                        Match
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={match.user2.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {match.user2.firstName?.[0]}{match.user2.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {match.user2.firstName} {match.user2.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {match.user2.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(match.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {matches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No matches yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
