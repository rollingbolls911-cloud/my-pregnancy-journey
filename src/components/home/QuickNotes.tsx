import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Pin, PinOff, Trash2, StickyNote } from "lucide-react";
import { QuickNote, getQuickNotes, saveQuickNote, deleteQuickNote, generateId } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function QuickNotes() {
  const [notes, setNotes] = useState<QuickNote[]>(() => getQuickNotes());
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const refreshNotes = () => {
    setNotes(getQuickNotes());
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: QuickNote = {
      id: generateId(),
      content: newNote.trim(),
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveQuickNote(note);
    setNewNote("");
    setIsAdding(false);
    refreshNotes();
  };

  const handleTogglePin = (note: QuickNote) => {
    const updated = { ...note, pinned: !note.pinned };
    saveQuickNote(updated);
    refreshNotes();
  };

  const handleDelete = (id: string) => {
    deleteQuickNote(id);
    refreshNotes();
  };

  // Sort: pinned first, then by creation date (newest first)
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Quick Notes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isAdding && (
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Doctor question, reminder..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              autoFocus
              className="text-sm"
            />
            <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
              Add
            </Button>
          </div>
        )}

        {sortedNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notes yet. Tap + to add one!
          </p>
        ) : (
          <ScrollArea className="max-h-48">
            <div className="space-y-2">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "flex items-start gap-2 p-2 rounded-lg text-sm",
                    note.pinned
                      ? "bg-primary/5 border border-primary/20"
                      : "bg-muted/50"
                  )}
                >
                  <p className="flex-1 text-foreground leading-relaxed">
                    {note.content}
                  </p>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePin(note)}
                      className="h-7 w-7 p-0"
                    >
                      {note.pinned ? (
                        <PinOff className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Pin className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
