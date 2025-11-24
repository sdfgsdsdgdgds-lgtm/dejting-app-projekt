import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Heart } from "lucide-react";
import type { MatchWithUsers } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function Matches() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: matches = [], isLoading } = useQuery<MatchWithUsers[]>({
    queryKey: ["/api/matches"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <Heart className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No matches yet</h2>
        <p className="text-muted-foreground text-center">
          Keep swiping to find your perfect match!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Matches</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const otherUser = match.user1.id === user?.id ? match.user2 : match.user1;
            
            return (
              <Card 
                key={match.id}
                className="overflow-hidden hover-elevate cursor-pointer"
                onClick={() => setLocation(`/chat/${match.id}`)}
                data-testid={`card-match-${match.id}`}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={otherUser.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.id}`}
                    alt={`${otherUser.firstName} ${otherUser.lastName}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/90">
                      <Heart className="w-3 h-3 mr-1" />
                      Match
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold" data-testid={`text-match-name-${match.id}`}>
                        {otherUser.firstName} {otherUser.lastName}
                      </h3>
                      {otherUser.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {otherUser.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {otherUser.interests && otherUser.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {otherUser.interests.slice(0, 3).map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {otherUser.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{otherUser.interests.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-primary gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Start chatting
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
