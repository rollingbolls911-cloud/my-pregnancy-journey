import { cn } from "@/lib/utils";
import { BumpPhoto } from "@/lib/storage";

interface PhotoGridProps {
  photos: BumpPhoto[];
  onPhotoClick: (photo: BumpPhoto) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-4xl">📷</span>
        </div>
        <h3 className="font-medium text-foreground mb-1">No photos yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start capturing your bump journey by adding your first photo
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {photos.map((photo) => (
        <button
          key={photo.id}
          onClick={() => onPhotoClick(photo)}
          className={cn(
            "relative aspect-square overflow-hidden rounded-md sm:rounded-lg",
            "bg-muted transition-transform active:scale-[0.98] touch-manipulation",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
        >
          <img
            src={photo.imageUrl}
            alt={`Week ${photo.week} bump photo`}
            className="h-full w-full object-cover"
          />
          {/* Week overlay badge */}
          <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2">
            <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium text-foreground">
              Week {photo.week}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
