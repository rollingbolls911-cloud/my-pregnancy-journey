import { usePregnancy } from "@/contexts/PregnancyContext";
import { getPersonalizedGreeting, getEncouragingMessage } from "@/lib/greetings";

interface PersonalizedGreetingProps {
  className?: string;
}

export function PersonalizedGreeting({ className }: PersonalizedGreetingProps) {
  const { profile } = usePregnancy();

  if (!profile) return null;

  const greeting = getPersonalizedGreeting(profile.name);
  const encouragement = getEncouragingMessage();

  return (
    <div className={className}>
      <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
        {greeting}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {encouragement}
      </p>
    </div>
  );
}
