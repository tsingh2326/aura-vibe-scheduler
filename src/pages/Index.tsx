import { useState } from "react";
import { EventCreationWizard } from "@/components/EventCreationWizard";
import { EventPoll } from "@/components/EventPoll";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Users, ArrowRight } from "lucide-react";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface EventData {
  title: string;
  description: string;
  location: string;
  duration: number;
  timeSlots: TimeSlot[];
  backdrop?: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "create" | "poll">("landing");
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);

  const handleEventCreated = (event: EventData) => {
    setCurrentEvent(event);
    setCurrentView("poll");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setCurrentEvent(null);
  };

  if (currentView === "create") {
    return <EventCreationWizard onEventCreated={handleEventCreated} />;
  }

  if (currentView === "poll" && currentEvent) {
    return <EventPoll event={currentEvent} onBack={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Aura
              </h1>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Scheduling with
                <span className="bg-gradient-primary bg-clip-text text-transparent"> AI Magic</span>
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create beautiful scheduling polls that set the perfect vibe. 
                AI-generated backdrops make every coordination delightful.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                variant="glow"
                onClick={() => setCurrentView("create")}
                className="text-lg px-8 py-4 h-auto"
              >
                <Sparkles className="w-5 h-5" />
                Create Event
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 h-auto"
              >
                <Calendar className="w-5 h-5" />
                View Demo
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-8 pt-16">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Backdrops</h3>
                <p className="text-muted-foreground">
                  Smart context detection generates perfect visuals for any occasion
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Effortless Coordination</h3>
                <p className="text-muted-foreground">
                  Doodle-style simplicity with modern, beautiful design
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Delightful Experience</h3>
                <p className="text-muted-foreground">
                  Boost engagement with visually appealing scheduling
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-primary-glow/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-secondary-accent/30 rounded-full blur-xl animate-pulse delay-500" />
    </div>
  );
};

export default Index;
