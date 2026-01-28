import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, StickyNote } from "lucide-react";
import { QuickNote, getQuickNotes, saveQuickNote, deleteQuickNote, generateId } from "@/lib/storage";
import { SwipeableNote } from "@/components/notes/SwipeableNote";
import { hapticFeedback } from "@/lib/haptics";
import { useAuth } from "@/contexts/AuthContext";
import { useCloudQuickNotes, useSaveCloudQuickNote, useDeleteCloudQuickNote, CloudQuickNote } from "@/hooks/useCloudStorage";

export function QuickNotes() {
  const { user } = useAuth();
  const { data: cloudNotes = [], isLoading } = useCloudQuickNotes();
  const saveCloudNote = useSaveCloudQuickNote();
  const deleteCloudNote = useDeleteCloudQuickNote();
  
  const [localNotes, setLocalNotes] = useState<QuickNote[]>(() => getQuickNotes());
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  // Convert cloud notes to local format for display
  const notes: QuickNote[] = user
    ? cloudNotes.map((n: CloudQuickNote) => ({
        id: n.id,
        content: n.content,
        pinned: n.pinned,
        createdAt: n.created_at,
        updatedAt: n.updated_at,
      }))
    : localNotes;

  const refreshLocalNotes = () => {
    setLocalNotes(getQuickNotes());
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    if (user) {
      saveCloudNote.mutate({
        content: newNote.trim(),
        pinned: false,
      });
    } else {
      const note: QuickNote = {
        id: generateId(),
        content: newNote.trim(),
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveQuickNote(note);
      refreshLocalNotes();
    }
    
    setNewNote("");
    setIsAdding(false);
    
    if (isHapticsEnabled()) {
      hapticFeedback("success");
    }
  };

  const handleTogglePin = (note: QuickNote) => {
    if (user) {
      saveCloudNote.mutate({
        id: note.id,
        content: note.content,
        pinned: !note.pinned,
      });
    } else {
      const updated = { ...note, pinned: !note.pinned };
      saveQuickNote(updated);
      refreshLocalNotes();
    }
    
    if (isHapticsEnabled()) {
      hapticFeedback("light");
    }
  };

  const handleDelete = (id: string) => {
    if (user) {
      deleteCloudNote.mutate(id);
    } else {
      deleteQuickNote(id);
      refreshLocalNotes();
    }
    
    if (isHapticsEnabled()) {
      hapticFeedback("medium");
    }
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
        <p className="text-xs text-muted-foreground md:hidden">
          Swipe left to delete
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {isAdding && (
          <div className="flex gap-2 mb-3 animate-fade-in">
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

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Loading notes...
          </p>
        ) : sortedNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notes yet. Tap + to add one!
          </p>
        ) : (
          <ScrollArea className="max-h-48">
            <div className="space-y-2">
              {sortedNotes.map((note) => (
                <SwipeableNote
                  key={note.id}
                  note={note}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
