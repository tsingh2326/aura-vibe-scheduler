import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Users, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import businessBackdrop from "@/assets/backdrop-business.jpg";
import celebrationBackdrop from "@/assets/backdrop-celebration.jpg";
import diningBackdrop from "@/assets/backdrop-dining.jpg";

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

interface EventCreationWizardProps {
  onEventCreated: (event: EventData) => void;
}

export function EventCreationWizard({ onEventCreated }: EventCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [isGeneratingBackdrop, setIsGeneratingBackdrop] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    location: "",
    duration: 60,
    timeSlots: [],
  });

  const generateAIBackdrop = async () => {
    if (!eventData.title) {
      toast.error("Please enter an event title first");
      return;
    }

    setIsGeneratingBackdrop(true);
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyze the event context to select appropriate backdrop
      const context = `${eventData.title} ${eventData.description} ${eventData.location}`.toLowerCase();
      let selectedBackdrop = businessBackdrop; // Default
      let detectedVibe = "professional";
      
      // Contextual backdrop selection based on event details
      if (context.includes("meeting") || context.includes("review") || context.includes("standup") || 
          context.includes("work") || context.includes("business") || context.includes("office")) {
        selectedBackdrop = businessBackdrop;
        detectedVibe = "business meeting";
      } else if (context.includes("party") || context.includes("celebration") || context.includes("birthday") ||
                 context.includes("wedding") || context.includes("anniversary") || context.includes("fun")) {
        selectedBackdrop = celebrationBackdrop;
        detectedVibe = "celebration";
      } else if (context.includes("dinner") || context.includes("lunch") || context.includes("food") ||
                 context.includes("restaurant") || context.includes("meal") || context.includes("eat")) {
        selectedBackdrop = diningBackdrop;
        detectedVibe = "dining experience";
      }
      
      setEventData(prev => ({ ...prev, backdrop: selectedBackdrop }));
      toast.success(`AI detected "${detectedVibe}" vibe and generated perfect backdrop! ✨`);
    } catch (error) {
      toast.error("Failed to generate backdrop");
    } finally {
      setIsGeneratingBackdrop(false);
    }
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      date: "",
      startTime: "",
      endTime: "",
    };
    setEventData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot]
    }));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setEventData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeTimeSlot = (id: string) => {
    setEventData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(slot => slot.id !== id)
    }));
  };

  const handleNext = () => {
    if (step === 1 && !eventData.title) {
      toast.error("Please enter an event title");
      return;
    }
    if (step === 2 && eventData.timeSlots.length === 0) {
      toast.error("Please add at least one time slot");
      return;
    }
    setStep(step + 1);
  };

  const handleCreate = () => {
    if (eventData.timeSlots.some(slot => !slot.date || !slot.startTime || !slot.endTime)) {
      toast.error("Please complete all time slots");
      return;
    }
    onEventCreated(eventData);
    toast.success("Event created successfully! 🎉");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Create Your Event
        </h1>
        <p className="text-muted-foreground">
          Set up your event and let AI create the perfect vibe
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3].map((number) => (
          <div
            key={number}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step >= number
                ? "bg-gradient-primary text-primary-foreground shadow-soft"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {number}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Team Sprint Planning, Birthday Party"
                value={eventData.title}
                onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                className="shadow-soft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details about your event..."
                value={eventData.description}
                onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                className="shadow-soft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Office, Zoom link, Restaurant..."
                value={eventData.location}
                onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                className="shadow-soft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                value={eventData.duration}
                onChange={(e) => setEventData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                className="shadow-soft"
              />
            </div>
            <div className="pt-4">
              <Button
                onClick={generateAIBackdrop}
                variant="glow"
                disabled={isGeneratingBackdrop}
                className="w-full"
              >
                {isGeneratingBackdrop ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Generating AI Backdrop...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate AI Backdrop
                  </>
                )}
              </Button>
            </div>
            {eventData.backdrop && (
              <div className="rounded-lg overflow-hidden shadow-medium">
                <img
                  src={eventData.backdrop}
                  alt="AI Generated Backdrop"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventData.timeSlots.map((slot) => (
              <div key={slot.id} className="p-4 bg-surface rounded-lg shadow-soft space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={slot.date}
                      onChange={(e) => updateTimeSlot(slot.id, "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(slot.id, "startTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(slot.id, "endTime", e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(slot.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              onClick={addTimeSlot}
              variant="outline"
              className="w-full"
            >
              <Clock className="w-4 h-4" />
              Add Time Slot
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Review & Create</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-soft rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">{eventData.title}</h3>
              {eventData.description && (
                <p className="text-muted-foreground">{eventData.description}</p>
              )}
              {eventData.location && (
                <p className="text-sm text-muted-foreground">📍 {eventData.location}</p>
              )}
              <p className="text-sm text-muted-foreground">⏱️ {eventData.duration} minutes</p>
            </div>
            
            {eventData.backdrop && (
              <div className="rounded-lg overflow-hidden shadow-medium">
                <img
                  src={eventData.backdrop}
                  alt="Event Backdrop"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold">Time Options:</h4>
              {eventData.timeSlots.map((slot) => (
                <div key={slot.id} className="p-3 bg-surface rounded-lg text-sm">
                  {slot.date} • {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-6">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <div className="ml-auto">
          {step < 3 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate} variant="glow">
              Create Event
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}