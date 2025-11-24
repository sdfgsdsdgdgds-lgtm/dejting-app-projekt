import { Home, User, Heart, MessageCircle, LogOut, Users, Database, Activity, MessageSquare, ThumbsUp } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const userItems = [
    {
      title: "Discover",
      url: "/",
      icon: Home,
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "Matches",
      url: "/matches",
      icon: Heart,
    },
  ];

  const adminItems = [
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: Database,
    },
    {
      title: "All Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "All Likes",
      url: "/admin/likes",
      icon: ThumbsUp,
    },
    {
      title: "All Matches",
      url: "/admin/matches",
      icon: Heart,
    },
    {
      title: "All Messages",
      url: "/admin/messages",
      icon: MessageSquare,
    },
    {
      title: "Activity Logs",
      url: "/admin/activity",
      icon: Activity,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary px-4 py-4">
            Connect
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.url)}
                    isActive={location === item.url}
                    data-testid={`sidebar-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setLocation(item.url)}
                      isActive={location === item.url}
                      data-testid={`sidebar-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <SidebarMenuButton
          onClick={() => window.location.href = "/api/logout"}
          className="w-full"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
