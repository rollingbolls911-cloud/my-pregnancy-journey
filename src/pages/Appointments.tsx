import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getUpcomingAppointments,
  getAppointments,
  saveAppointment,
  deleteAppointment,
  Appointment,
  generateId,
} from "@/lib/storage";
import { format, parseISO, set } from "date-fns";
import { Plus, CalendarCheck, MapPin, User, Trash2, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [provider, setProvider] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const data = getAppointments();
    setAppointments(data.sort((a, b) => a.datetime.localeCompare(b.datetime)));
  };

  const handleSave = () => {
    if (!title.trim() || !date) {
      toast.error("Please provide a title and date");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const datetime = set(date, { hours, minutes }).toISOString();

    const appointment: Appointment = {
      id: editingAppointment?.id || generateId(),
      title: title.trim(),
      datetime,
      location: location.trim() || undefined,
      provider: provider.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: editingAppointment?.createdAt || new Date().toISOString(),
    };

    saveAppointment(appointment);
    loadAppointments();
    resetForm();
    setIsDialogOpen(false);
    toast.success(editingAppointment ? "Appointment updated!" : "Appointment added!");
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    loadAppointments();
    toast.success("Appointment deleted");
  };

  const handleEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setTitle(apt.title);
    const aptDate = parseISO(apt.datetime);
    setDate(aptDate);
    setTime(format(aptDate, "HH:mm"));
    setLocation(apt.location || "");
    setProvider(apt.provider || "");
    setNotes(apt.notes || "");
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setDate(undefined);
    setTime("09:00");
    setLocation("");
    setProvider("");
    setNotes("");
    setEditingAppointment(null);
  };

  const openNewAppointment = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter((a) => parseISO(a.datetime) >= now);
  const pastAppointments = appointments.filter((a) => parseISO(a.datetime) < now);

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage your prenatal visits</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewAppointment} size="sm" className="h-9 sm:h-10 touch-manipulation">
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">
                  {editingAppointment ? "Edit Appointment" : "New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="apt-title" className="text-sm">Title *</Label>
                  <Input
                    id="apt-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., OB Checkup, Ultrasound"
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10 sm:h-11 text-xs sm:text-sm",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {date ? format(date, "MMM d") : "Pick"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="apt-time" className="text-sm">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="apt-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="pl-8 sm:pl-9 h-10 sm:h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="apt-provider" className="text-sm">Provider</Label>
                  <Input
                    id="apt-provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="e.g., Dr. Smith"
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="apt-location" className="text-sm">Location</Label>
                  <Input
                    id="apt-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., City Hospital, Room 204"
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="apt-notes" className="text-sm">Notes</Label>
                  <Textarea
                    id="apt-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Questions to ask, things to remember..."
                    className="resize-none text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 h-10 sm:h-11 touch-manipulation"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1 h-10 sm:h-11 touch-manipulation">
                    {editingAppointment ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 sm:py-12 text-center">
              <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-chart-1/10 flex items-center justify-center mb-3 sm:mb-4">
                <CalendarCheck className="h-7 w-7 sm:h-8 sm:w-8 text-chart-1" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                No appointments yet
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-4">
                Keep track of your prenatal visits
              </p>
              <Button onClick={openNewAppointment} className="touch-manipulation">
                <Plus className="h-4 w-4 mr-2" />
                Add First Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Upcoming */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
                  UPCOMING
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
                  PAST
                </h2>
                <div className="space-y-2 sm:space-y-3 opacity-60">
                  {pastAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
}: {
  appointment: Appointment;
  onEdit: (apt: Appointment) => void;
  onDelete: (id: string) => void;
}) {
  const aptDate = parseISO(appointment.datetime);

  return (
    <Card
      className="cursor-pointer transition-all active:scale-[0.98] touch-manipulation"
      onClick={() => onEdit(appointment)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Date Badge */}
          <div className="flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
            <span className="text-[10px] sm:text-xs font-medium text-primary">
              {format(aptDate, "MMM")}
            </span>
            <span className="text-lg sm:text-xl font-bold text-primary">
              {format(aptDate, "d")}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">
              {appointment.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {format(aptDate, "h:mm a")}
            </p>
            {appointment.provider && (
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-0.5 sm:mt-1">
                <User className="h-3 w-3" />
                <span className="truncate">{appointment.provider}</span>
              </p>
            )}
            {appointment.location && (
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{appointment.location}</span>
              </p>
            )}
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(appointment.id);
            }}
            className="flex-shrink-0 text-muted-foreground hover:text-destructive h-8 w-8 sm:h-9 sm:w-9 touch-manipulation"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
