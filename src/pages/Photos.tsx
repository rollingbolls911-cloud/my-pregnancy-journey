import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { PhotoUpload } from "@/components/photos/PhotoUpload";
import { PhotoViewer } from "@/components/photos/PhotoViewer";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import {
  BumpPhoto,
  getBumpPhotos,
  saveBumpPhoto,
  deleteBumpPhoto,
  updateBumpPhotoCaption,
  generateId,
} from "@/lib/storage";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";

export default function Photos() {
  const [photos, setPhotos] = useState<BumpPhoto[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<BumpPhoto | null>(null);

  useEffect(() => {
    setPhotos(getBumpPhotos());
  }, []);

  const handleSavePhoto = (imageUrl: string, caption: string, week: number) => {
    const newPhoto: BumpPhoto = {
      id: generateId(),
      imageUrl,
      caption,
      week,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveBumpPhoto(newPhoto);
    setPhotos(getBumpPhotos());
    toast({
      title: "Photo saved! 📸",
      description: `Week ${week} bump photo added to your album.`,
    });
  };

  const handleDeletePhoto = (id: string) => {
    deleteBumpPhoto(id);
    setPhotos(getBumpPhotos());
    setSelectedPhoto(null);
    toast({
      title: "Photo deleted",
      description: "The photo has been removed from your album.",
    });
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    updateBumpPhotoCaption(id, caption);
    setPhotos(getBumpPhotos());
  };

  const handleExportAll = async () => {
    triggerHaptic("medium");
    
    if (photos.length === 0) {
      toast({
        title: "No photos to export",
        description: "Add some bump photos first!",
        variant: "destructive",
      });
      return;
    }

    // Create a simple collage/grid export
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = Math.min(photos.length, 3);
    const rows = Math.ceil(photos.length / cols);
    const cellSize = 300;
    
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    // Fill background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw images
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
      });
    };

    for (let i = 0; i < photos.length; i++) {
      const img = await loadImage(photos[i].imageUrl);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellSize;
      const y = row * cellSize;

      // Draw image (cover style)
      const scale = Math.max(cellSize / img.width, cellSize / img.height);
      const sw = cellSize / scale;
      const sh = cellSize / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;

      ctx.drawImage(img, sx, sy, sw, sh, x, y, cellSize, cellSize);

      // Draw week badge
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.roundRect(x + 10, y + cellSize - 40, 70, 30, 15);
      ctx.fill();

      ctx.fillStyle = "#333";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`Week ${photos[i].week}`, x + 45, y + cellSize - 20);
    }

    // Download
    const link = document.createElement("a");
    link.download = "bump-journey-collage.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.click();

    toast({
      title: "Collage exported! 🎉",
      description: "Your bump journey collage has been downloaded.",
    });
  };

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Photo Album</h1>
            <p className="text-sm text-muted-foreground">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </p>
          </div>
          <div className="flex gap-2">
            {photos.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={handleExportAll}
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
            <Button
              size="icon"
              className="h-10 w-10"
              onClick={() => setShowUpload(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Photo Grid */}
        <PhotoGrid photos={photos} onPhotoClick={setSelectedPhoto} />

        {/* Upload Dialog */}
        <PhotoUpload
          open={showUpload}
          onOpenChange={setShowUpload}
          onSave={handleSavePhoto}
        />

        {/* Photo Viewer */}
        <PhotoViewer
          photos={photos}
          currentPhoto={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={handleDeletePhoto}
          onUpdateCaption={handleUpdateCaption}
        />
      </div>
    </AppLayout>
  );
}
