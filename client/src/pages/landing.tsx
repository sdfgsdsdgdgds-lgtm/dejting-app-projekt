import { Heart, MessageCircle, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@assets/generated_images/hero_section_background_image.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Find Your Perfect Match
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with amazing people, build meaningful relationships, and discover genuine connections
          </p>
          <Button 
            size="lg"
            className="h-14 px-8 text-lg rounded-full"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Connect
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The modern way to meet people and build lasting connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover-elevate">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our intelligent system helps you find people who share your interests and values
              </p>
            </Card>

            <Card className="p-8 hover-elevate">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Chat</h3>
              <p className="text-muted-foreground">
                Connect instantly with your matches through our seamless messaging platform
              </p>
            </Card>

            <Card className="p-8 hover-elevate">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Genuine Profiles</h3>
              <p className="text-muted-foreground">
                Meet real people looking for authentic connections and meaningful relationships
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Start your journey in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and tell us about yourself, your interests, and what you're looking for
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse & Connect</h3>
              <p className="text-muted-foreground">
                Discover profiles that match your interests and send likes to people you're interested in
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Chatting</h3>
              <p className="text-muted-foreground">
                When both of you like each other, it's a match! Start chatting and get to know each other
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Match?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of people who have found meaningful connections
          </p>
          <Button 
            size="lg"
            className="h-14 px-8 text-lg rounded-full"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-join-now"
          >
            Join Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
