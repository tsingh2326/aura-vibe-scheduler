import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, Users, Check, X, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

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

interface Vote {
  slotId: string;
  participantName: string;
  available: boolean;
}

interface EventPollProps {
  event: EventData;
  onBack: () => void;
}

export function EventPoll({ event, onBack }: EventPollProps) {
  const [participantName, setParticipantName] = useState("");
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentUserVotes, setCurrentUserVotes] = useState<Record<string, boolean>>({});
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (slotId: string, available: boolean) => {
    setCurrentUserVotes(prev => ({
      ...prev,
      [slotId]: available
    }));
  };

  const submitVotes = () => {
    if (!participantName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const newVotes = Object.entries(currentUserVotes).map(([slotId, available]) => ({
      slotId,
      participantName,
      available
    }));

    setVotes(prev => [...prev, ...newVotes]);
    setHasVoted(true);
    toast.success("Your availability has been recorded! 🎉");
  };

  const getSlotVotes = (slotId: string) => {
    return votes.filter(vote => vote.slotId === slotId);
  };

  const getAvailableCount = (slotId: string) => {
    return votes.filter(vote => vote.slotId === slotId && vote.available).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const copyPollLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Poll link copied to clipboard!");
  };

  const sharePoll = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Help me find the best time for: ${event.title}`,
        url: window.location.href,
      });
    } else {
      copyPollLink();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Event Header with Backdrop */}
      <div className="relative rounded-xl overflow-hidden shadow-strong">
        {event.backdrop && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.backdrop})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
        )}
        <div className="relative p-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              {event.description && (
                <p className="text-white/90 text-lg">{event.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={sharePoll}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyPollLink}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.duration} minutes
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {new Set(votes.map(v => v.participantName)).size} participants
            </div>
          </div>
        </div>
      </div>

      {/* Voting Interface */}
      {!hasVoted ? (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Select Your Availability</CardTitle>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {event.timeSlots.map((slot) => (
                <div key={slot.id} className="p-4 bg-surface rounded-lg shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {formatDate(slot.date)}
                      </div>
                      <div className="text-muted-foreground">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={currentUserVotes[slot.id] === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVote(slot.id, true)}
                      >
                        <Check className="w-4 h-4" />
                        Available
                      </Button>
                      <Button
                        variant={currentUserVotes[slot.id] === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleVote(slot.id, false)}
                      >
                        <X className="w-4 h-4" />
                        Busy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6">
              <Button onClick={submitVotes} className="w-full" variant="glow">
                Submit Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-center text-success">
              ✅ Thank you for voting!
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Results */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Current Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event.timeSlots.map((slot) => {
              const availableCount = getAvailableCount(slot.id);
              const slotVotes = getSlotVotes(slot.id);
              const totalVoters = new Set(slotVotes.map(v => v.participantName)).size;
              
              return (
                <div key={slot.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {formatDate(slot.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    </div>
                    <Badge variant={availableCount > 0 ? "default" : "secondary"}>
                      {availableCount} available
                    </Badge>
                  </div>
                  
                  {totalVoters > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(slotVotes.map(v => v.participantName))).map((name) => {
                        const userVote = slotVotes.find(v => v.participantName === name);
                        return (
                          <div key={name} className="flex items-center gap-1">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{name}</span>
                            {userVote?.available ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <X className="w-3 h-3 text-destructive" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack}>
          Create Another Event
        </Button>
      </div>
    </div>
  );
}