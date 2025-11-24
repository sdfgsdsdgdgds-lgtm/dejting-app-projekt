import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, X } from "lucide-react";
import type { User } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bio, setBio] = useState("");
  const [currentInterest, setCurrentInterest] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setInterests(user.interests || []);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data: { bio?: string; interests?: string[] }) => {
      await apiRequest("PATCH", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
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
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddInterest = () => {
    if (currentInterest.trim() && interests.length < 10) {
      setInterests([...interests, currentInterest.trim()]);
      setCurrentInterest("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ bio, interests });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold" data-testid="text-user-name">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground" data-testid="text-user-email">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself..."
                className="mt-2 min-h-32"
                maxLength={500}
                data-testid="input-bio"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {bio.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="interest">Interests</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="interest"
                  value={currentInterest}
                  onChange={(e) => setCurrentInterest(e.target.value)}
                  placeholder="Add an interest..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  disabled={interests.length >= 10}
                  data-testid="input-interest"
                />
                <Button
                  type="button"
                  onClick={handleAddInterest}
                  disabled={!currentInterest.trim() || interests.length >= 10}
                  data-testid="button-add-interest"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {interests.map((interest, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="gap-1"
                    data-testid={`badge-interest-${idx}`}
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(idx)}
                      className="ml-1 hover-elevate rounded-full"
                      data-testid={`button-remove-interest-${idx}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {interests.length}/10 interests
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="w-full"
              data-testid="button-save-profile"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
