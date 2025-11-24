import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Users, Heart, MessageSquare, Activity } from "lucide-react";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalLikes: number;
  totalMatches: number;
  totalMessages: number;
  recentActivity: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Likes",
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: "text-primary",
    },
    {
      title: "Total Matches",
      value: stats?.totalMatches || 0,
      icon: Heart,
      color: "text-green-500",
    },
    {
      title: "Total Messages",
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Use the sidebar to navigate through different admin sections
            to view and manage users, profiles, likes, matches, messages, and activity logs.
          </p>
        </Card>
      </div>
    </div>
  );
}
