import { TodayCard } from "@/components/home/TodayCard";
import { QuickActions } from "@/components/home/QuickActions";
import { GuidancePreview } from "@/components/home/GuidancePreview";
import { QuickNotes } from "@/components/home/QuickNotes";
import { ProfileCard } from "@/components/home/ProfileCard";
import { BabySizeCard } from "@/components/home/BabySizeCard";
import { ProfileSetup } from "@/components/setup/ProfileSetup";
import { AppLayout } from "@/components/layout/AppLayout";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
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
        <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5 border-border/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-chart-1/20 to-chart-1/5 flex items-center justify-center shadow-sm">
              <CalendarCheck className="h-6 w-6 text-chart-1" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">No upcoming appointments</p>
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
      <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5 border-border/30">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-chart-1/20 to-chart-1/5 flex items-center justify-center shadow-sm">
            <CalendarCheck className="h-6 w-6 text-chart-1" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{nextAppointment.title}</p>
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
      <div className="px-4 py-5 sm:px-5 sm:py-7 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Profile Card */}
        <AnimatedSection delay={0} direction="up">
          <div className="mb-5 sm:mb-6">
            <ProfileCard />
          </div>
        </AnimatedSection>

        {/* Today Card */}
        <AnimatedSection delay={100} direction="up">
          <div className="mb-5 sm:mb-6">
            <TodayCard />
          </div>
        </AnimatedSection>

        {/* Baby Size Card */}
        <AnimatedSection delay={150} direction="up">
          <div className="mb-5 sm:mb-6">
            <BabySizeCard />
          </div>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection delay={200} direction="up">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Quick Actions</h2>
            <QuickActions />
          </div>
        </AnimatedSection>

        {/* Quick Notes */}
        <AnimatedSection delay={300} direction="up">
          <div className="mb-5 sm:mb-6">
            <QuickNotes />
          </div>
        </AnimatedSection>

        {/* Upcoming Appointment */}
        <AnimatedSection delay={400} direction="up">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Next Appointment</h2>
            <UpcomingAppointment />
          </div>
        </AnimatedSection>

        {/* Guidance Preview */}
        <AnimatedSection delay={500} direction="up">
          <div className="mb-5 sm:mb-6">
            <GuidancePreview />
          </div>
        </AnimatedSection>
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
