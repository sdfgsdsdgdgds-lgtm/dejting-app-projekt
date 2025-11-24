import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActivityLog, User } from "@shared/schema";

interface ActivityLogWithUser extends ActivityLog {
  user?: User;
}

export default function AdminActivity() {
  const [search, setSearch] = useState("");
  
  const { data: logs = [], isLoading } = useQuery<ActivityLogWithUser[]>({
    queryKey: ["/api/admin/activity"],
  });

  const filteredLogs = logs.filter((log) => {
    const searchLower = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.user?.firstName?.toLowerCase().includes(searchLower) ||
      log.user?.lastName?.toLowerCase().includes(searchLower)
    );
  });

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("login")) return "default";
    if (action.includes("update")) return "secondary";
    if (action.includes("like")) return "outline";
    return "secondary";
  };

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
        <h1 className="text-3xl font-bold mb-8">Activity Logs</h1>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activity logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search-activity"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} data-testid={`row-activity-${log.id}`}>
                    <TableCell>
                      {log.user ? (
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={log.user.profileImageUrl || undefined} />
                            <AvatarFallback>
                              {log.user.firstName?.[0]}{log.user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {log.user.firstName} {log.user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {log.user.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      {log.metadata ? (
                        <pre className="text-xs text-muted-foreground overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
