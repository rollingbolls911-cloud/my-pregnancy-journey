import { usePregnancy } from "@/contexts/PregnancyContext";
import { getPersonalizedGreeting, getEncouragingMessage, getTimeOfDay } from "@/lib/greetings";
import { timeIcons } from "@/lib/icons";

interface PersonalizedGreetingProps {
  className?: string;
}

export function PersonalizedGreeting({ className }: PersonalizedGreetingProps) {
  const { profile } = usePregnancy();

  if (!profile) return null;

  const greeting = getPersonalizedGreeting(profile.name);
  const encouragement = getEncouragingMessage();
  const timeOfDay = getTimeOfDay();
  const TimeIcon = timeIcons[timeOfDay];

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <TimeIcon className="h-5 w-5 text-primary" />
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          {greeting}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        {encouragement}
      </p>
    </div>
  );
}
