import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X } from "lucide-react";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { triggerHaptic } from "@/lib/haptics";

interface PhotoUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (imageUrl: string, caption: string, week: number) => void;
}

export function PhotoUpload({ open, onOpenChange, onSave }: PhotoUploadProps) {
  const { gestationalAge } = usePregnancy();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [week, setWeek] = useState(gestationalAge?.weeks || 1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (imageUrl) {
      triggerHaptic("success");
      onSave(imageUrl, caption, week);
      handleClose();
    }
  };

  const handleClose = () => {
    setImageUrl(null);
    setCaption("");
    setWeek(gestationalAge?.weeks || 1);
    onOpenChange(false);
  };

  const clearImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Bump Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image upload area */}
          {!imageUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center h-48 sm:h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors touch-manipulation"
            >
              <div className="flex gap-4 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">Tap to add photo</p>
              <p className="text-xs text-muted-foreground">Take a photo or choose from gallery</p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Week selector */}
          <div className="space-y-2">
            <Label>Week</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeek(Math.max(1, week - 1))}
                disabled={week <= 1}
              >
                -
              </Button>
              <span className="flex-1 text-center font-medium">Week {week}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeek(Math.min(42, week + 1))}
                disabled={week >= 42}
              >
                +
              </Button>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="How are you feeling this week?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={!imageUrl}>
              Save Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
