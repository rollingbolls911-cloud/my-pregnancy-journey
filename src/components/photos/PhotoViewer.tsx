import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BumpPhoto } from "@/lib/storage";
import { ChevronLeft, ChevronRight, X, Download, Share2, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface PhotoViewerProps {
  photos: BumpPhoto[];
  currentPhoto: BumpPhoto | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
}

export function PhotoViewer({
  photos,
  currentPhoto,
  onClose,
  onDelete,
  onUpdateCaption,
}: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState("");

  useEffect(() => {
    if (currentPhoto) {
      const index = photos.findIndex((p) => p.id === currentPhoto.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [currentPhoto, photos]);

  const photo = photos[currentIndex];

  if (!photo) return null;

  const goNext = () => {
    triggerHaptic("light");
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setIsEditing(false);
  };

  const goPrev = () => {
    triggerHaptic("light");
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setIsEditing(false);
  };

  const handleDownload = () => {
    triggerHaptic("medium");
    const link = document.createElement("a");
    link.href = photo.imageUrl;
    link.download = `bump-week-${photo.week}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    triggerHaptic("medium");
    if (navigator.share) {
      try {
        const blob = await fetch(photo.imageUrl).then((r) => r.blob());
        const file = new File([blob], `bump-week-${photo.week}.jpg`, { type: "image/jpeg" });
        await navigator.share({
          title: `Week ${photo.week} Bump Photo`,
          text: photo.caption || `My bump at week ${photo.week}!`,
          files: [file],
        });
      } catch (err) {
        // User cancelled or share failed
      }
    }
  };

  const handleDelete = () => {
    triggerHaptic("warning");
    onDelete(photo.id);
    if (photos.length <= 1) {
      onClose();
    } else if (currentIndex >= photos.length - 1) {
      setCurrentIndex(0);
    }
    setShowDeleteDialog(false);
  };

  const handleEditSave = () => {
    onUpdateCaption(photo.id, editCaption);
    setIsEditing(false);
    triggerHaptic("success");
  };

  const startEditing = () => {
    setEditCaption(photo.caption || "");
    setIsEditing(true);
  };

  return (
    <>
      <Dialog open={!!currentPhoto} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 bg-background/95 backdrop-blur-md border-none">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-background/80 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/50"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {navigator.share && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-background/50"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/50"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/50 text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex items-center justify-center h-full px-4">
            <img
              src={photo.imageUrl}
              alt={`Week ${photo.week}`}
              className="max-h-[70vh] max-w-full object-contain rounded-lg"
            />
          </div>

          {/* Navigation arrows */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50",
                  "hidden sm:flex"
                )}
                onClick={goPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50",
                  "hidden sm:flex"
                )}
                onClick={goNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-background/80 to-transparent">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                  Week {photo.week}
                </span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(photo.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Add a caption..."
                    rows={2}
                    className="bg-background/80"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleEditSave}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="text-foreground flex-1">
                    {photo.caption || (
                      <span className="text-muted-foreground italic">No caption</span>
                    )}
                  </p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={startEditing}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Pagination dots */}
              {photos.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        triggerHaptic("light");
                      }}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        idx === currentIndex ? "bg-primary w-4" : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this bump photo. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
