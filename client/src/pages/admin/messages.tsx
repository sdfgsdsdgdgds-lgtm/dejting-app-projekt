import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Message, User, Match } from "@shared/schema";

interface MessageWithDetails extends Message {
  sender: User;
  match: Match & {
    user1: User;
    user2: User;
  };
}

export default function AdminMessages() {
  const [search, setSearch] = useState("");
  
  const { data: messages = [], isLoading } = useQuery<MessageWithDetails[]>({
    queryKey: ["/api/admin/messages"],
  });

  const filteredMessages = messages.filter((message) => {
    const searchLower = search.toLowerCase();
    return (
      message.content.toLowerCase().includes(searchLower) ||
      message.sender.firstName?.toLowerCase().includes(searchLower) ||
      message.sender.lastName?.toLowerCase().includes(searchLower)
    );
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
        <h1 className="text-3xl font-bold mb-8">All Messages</h1>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search-messages"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => {
                  const otherUser = message.match.user1.id === message.senderId 
                    ? message.match.user2 
                    : message.match.user1;
                    
                  return (
                    <TableRow key={message.id} data-testid={`row-message-${message.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={message.sender.profileImageUrl || undefined} />
                            <AvatarFallback>
                              {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {message.sender.firstName} {message.sender.lastName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={otherUser.profileImageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {otherUser.firstName?.[0]}{otherUser.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {otherUser.firstName} {otherUser.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{message.content}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(message.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No messages found</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
