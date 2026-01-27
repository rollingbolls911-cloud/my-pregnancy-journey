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
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage your prenatal visits</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? "Edit Appointment" : "New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="apt-title">Title *</Label>
                  <Input
                    id="apt-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., OB Checkup, Ultrasound"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMM d, yyyy") : "Pick date"}
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

                  <div className="space-y-2">
                    <Label htmlFor="apt-time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="apt-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apt-provider">Provider</Label>
                  <Input
                    id="apt-provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="e.g., Dr. Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apt-location">Location</Label>
                  <Input
                    id="apt-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., City Hospital, Room 204"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apt-notes">Notes</Label>
                  <Textarea
                    id="apt-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Questions to ask, things to remember..."
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    {editingAppointment ? "Update" : "Add Appointment"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-chart-1/10 flex items-center justify-center mb-4">
                <CalendarCheck className="h-8 w-8 text-chart-1" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No appointments yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Keep track of your prenatal visits
              </p>
              <Button onClick={openNewAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Upcoming */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  UPCOMING
                </h2>
                <div className="space-y-3">
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
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  PAST
                </h2>
                <div className="space-y-3 opacity-60">
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
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => onEdit(appointment)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Date Badge */}
          <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {format(aptDate, "MMM")}
            </span>
            <span className="text-xl font-bold text-primary">
              {format(aptDate, "d")}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {appointment.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {format(aptDate, "h:mm a")}
            </p>
            {appointment.provider && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <User className="h-3 w-3" />
                {appointment.provider}
              </p>
            )}
            {appointment.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {appointment.location}
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
            className="flex-shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
