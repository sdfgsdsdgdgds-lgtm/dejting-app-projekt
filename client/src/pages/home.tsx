import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/schema";
import femaleProfile1 from "@assets/generated_images/female_profile_placeholder_1.png";
import maleProfile1 from "@assets/generated_images/male_profile_placeholder_1.png";
import femaleProfile2 from "@assets/generated_images/female_profile_placeholder_2.png";
import maleProfile2 from "@assets/generated_images/male_profile_placeholder_2.png";

const placeholderImages = [femaleProfile1, maleProfile1, femaleProfile2, maleProfile2];

export default function Home() {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: profiles = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/profiles"],
  });

  const likeMutation = useMutation({
    mutationFn: async (toUserId: string) => {
      await apiRequest("POST", "/api/likes", { toUserId });
    },
    onSuccess: (_, toUserId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setCurrentIndex(prev => prev + 1);
      toast({
        title: "Like sent!",
        description: "We'll let you know if it's a match!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const passMutation = useMutation({
    mutationFn: async () => {
      setCurrentIndex(prev => prev + 1);
    },
  });

  const currentProfile = profiles[currentIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <Heart className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
        <p className="text-muted-foreground text-center">
          Check back later for new people to connect with!
        </p>
      </div>
    );
  }

  const imageIndex = currentIndex % placeholderImages.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden">
          <div className="relative aspect-[3/4]">
            <img
              src={currentProfile.profileImageUrl || placeholderImages[imageIndex]}
              alt={`${currentProfile.firstName} ${currentProfile.lastName}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-3xl font-bold text-white mb-1" data-testid={`text-profile-name-${currentProfile.id}`}>
                {currentProfile.firstName} {currentProfile.lastName}
              </h2>
              {currentProfile.bio && (
                <p className="text-white/90 mb-3" data-testid={`text-profile-bio-${currentProfile.id}`}>
                  {currentProfile.bio}
                </p>
              )}
              {currentProfile.interests && currentProfile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="bg-white/20 text-white border-white/30"
                      data-testid={`badge-interest-${idx}`}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 flex justify-center gap-4">
            <Button
              size="icon"
              variant="outline"
              className="w-16 h-16 rounded-full border-2"
              onClick={() => passMutation.mutate()}
              disabled={likeMutation.isPending}
              data-testid="button-pass"
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              size="icon"
              className="w-16 h-16 rounded-full"
              onClick={() => likeMutation.mutate(currentProfile.id)}
              disabled={likeMutation.isPending}
              data-testid="button-like"
            >
              {likeMutation.isPending ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Heart className="w-8 h-8" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
