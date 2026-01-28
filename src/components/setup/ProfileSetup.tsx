import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { format, subMonths, addMonths } from "date-fns";
import { CalendarIcon, Flower2, Heart, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSetup() {
  const { setupProfile, setupProfileWithDueDate } = usePregnancy();
  const [name, setName] = useState("HANAN");
  const [lmpDate, setLmpDate] = useState<Date | undefined>();
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [activeTab, setActiveTab] = useState("lmp");

  const handleSubmit = () => {
    if (activeTab === "lmp" && lmpDate) {
      setupProfile(lmpDate, name);
    } else if (activeTab === "due" && dueDate) {
      setupProfileWithDueDate(dueDate, name);
    }
  };

  const isValid = (activeTab === "lmp" && lmpDate) || (activeTab === "due" && dueDate);

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-background via-accent/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-none mx-auto">
        <CardHeader className="text-center pb-2 px-4 sm:px-6">
          <div className="mx-auto mb-3 sm:mb-4 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Flower2 className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Welcome to Bloom</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Let's set up your pregnancy journey 💕
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Name input */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name" className="text-sm">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-base sm:text-lg h-11 sm:h-12"
            />
          </div>

          {/* Date selection tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10 sm:h-11">
              <TabsTrigger value="lmp" className="text-xs sm:text-sm">Last Period</TabsTrigger>
              <TabsTrigger value="due" className="text-xs sm:text-sm">Due Date</TabsTrigger>
            </TabsList>

            <TabsContent value="lmp" className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
              <Label className="text-sm">First day of your last period</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11 sm:h-12 text-sm sm:text-base",
                      !lmpDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lmpDate ? format(lmpDate, "MMMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={lmpDate}
                    onSelect={setLmpDate}
                    defaultMonth={subMonths(new Date(), 2)}
                    disabled={(date) =>
                      date > new Date() || date < subMonths(new Date(), 10)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                We'll calculate your due date from this
              </p>
            </TabsContent>

            <TabsContent value="due" className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
              <Label className="text-sm">Your estimated due date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11 sm:h-12 text-sm sm:text-base",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    defaultMonth={addMonths(new Date(), 6)}
                    disabled={(date) =>
                      date < new Date() || date > addMonths(new Date(), 10)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                If you know your due date from your doctor
              </p>
            </TabsContent>
          </Tabs>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-11 sm:h-12 text-base sm:text-lg font-medium touch-manipulation"
            size="lg"
          >
            <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Start My Journey
          </Button>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 pt-1 sm:pt-2">
            <AlertCircle className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              This app provides general guidance only. Always consult your healthcare provider for medical advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
