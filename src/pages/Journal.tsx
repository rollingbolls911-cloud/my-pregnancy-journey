import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemoryTimeline } from "@/components/journal/MemoryTimeline";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
  JournalEntry,
  generateId,
} from "@/lib/storage";
import { format } from "date-fns";
import { Plus, BookHeart, Trash2, Heart, PenLine, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const data = getJournalEntries();
    // Sort by date field (descending), then by createdAt for same-date entries
    setEntries(data.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.createdAt.localeCompare(a.createdAt);
    }));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    const entry: JournalEntry = {
      id: editingEntry?.id || generateId(),
      date: format(selectedDate, "yyyy-MM-dd"),
      title: title.trim(),
      content: content.trim(),
      tags: [],
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveJournalEntry(entry);
    loadEntries();
    resetForm();
    setIsDialogOpen(false);
    toast.success(editingEntry ? "Entry updated!" : "Entry saved!");
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    loadEntries();
    toast.success("Entry deleted");
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedDate(new Date(entry.date));
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedDate(new Date());
    setEditingEntry(null);
  };

  const openNewEntry = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <AnimatedSection delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Journal</h1>
              <p className="text-muted-foreground">Your private thoughts & memories</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewEntry} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingEntry ? "Edit Entry" : "New Journal Entry"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give this entry a title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Your thoughts</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write about your day, feelings, or anything on your mind..."
                      className="min-h-[150px] resize-none"
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
                      {editingEntry ? "Update" : "Save Entry"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </AnimatedSection>

        {/* Tabs for Memories and Journal */}
        <AnimatedSection delay={100}>
          <Tabs defaultValue="memories" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="memories" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Memories
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <PenLine className="h-4 w-4" />
                Journal
              </TabsTrigger>
            </TabsList>

            {/* Memory Timeline Tab */}
            <TabsContent value="memories" className="mt-0">
              <MemoryTimeline />
            </TabsContent>

            {/* Journal Entries Tab */}
            <TabsContent value="journal" className="mt-0">
              {entries.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookHeart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No journal entries yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start documenting your pregnancy journey
                    </p>
                    <Button onClick={openNewEntry}>
                      <Plus className="h-4 w-4 mr-2" />
                      Write Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry, index) => (
                    <AnimatedSection key={entry.id} delay={index * 50}>
                      <Card
                        className="cursor-pointer transition-all hover:shadow-md"
                        onClick={() => handleEdit(entry)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">
                                {format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
                              </p>
                              <h3 className="font-semibold text-foreground mb-1 truncate">
                                {entry.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {entry.content}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(entry.id);
                              }}
                              className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </AnimatedSection>
      </div>
    </AppLayout>
  );
}
