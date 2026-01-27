import { TodayCard } from "@/components/home/TodayCard";
import { QuickActions } from "@/components/home/QuickActions";
import { GuidancePreview } from "@/components/home/GuidancePreview";
import { QuickNotes } from "@/components/home/QuickNotes";
import { ProfileSetup } from "@/components/setup/ProfileSetup";
import { AppLayout } from "@/components/layout/AppLayout";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getUpcomingAppointments } from "@/lib/storage";
import { format } from "date-fns";

function UpcomingAppointment() {
  const appointments = getUpcomingAppointments();
  const nextAppointment = appointments[0];

  if (!nextAppointment) {
    return (
      <Link to="/appointments">
        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-chart-1/10 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6 text-chart-1" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">No upcoming appointments</p>
              <p className="text-sm text-muted-foreground">Tap to add one</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to="/appointments">
      <Card className="transition-all hover:shadow-md">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-chart-1/10 flex items-center justify-center">
            <CalendarCheck className="h-6 w-6 text-chart-1" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{nextAppointment.title}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(nextAppointment.datetime), "MMM d 'at' h:mm a")}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}

function HomePage() {
  const { profile, gestationalAge } = usePregnancy();

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <p className="text-muted-foreground text-sm sm:text-base">Hello, {profile?.name} 💕</p>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {gestationalAge ? `Week ${gestationalAge.weeks}` : "Your Journey"}
          </h1>
        </div>

        {/* Today Card */}
        <div className="mb-4 sm:mb-6">
          <TodayCard />
        </div>

        {/* Quick Actions */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Quick Notes */}
        <div className="mb-4 sm:mb-6">
          <QuickNotes />
        </div>

        {/* Upcoming Appointment */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Next Appointment</h2>
          <UpcomingAppointment />
        </div>

        {/* Guidance Preview */}
        <div className="mb-4 sm:mb-6">
          <GuidancePreview />
        </div>
      </div>
    </AppLayout>
  );
}

const Index = () => {
  const { isSetupComplete } = usePregnancy();

  if (!isSetupComplete) {
    return <ProfileSetup />;
  }

  return <HomePage />;
};

export default Index;
