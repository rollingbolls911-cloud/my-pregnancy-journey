import { cn } from "@/lib/utils";

interface BlobProps {
  className?: string;
  style?: React.CSSProperties;
}

function Blob({ className, style }: BlobProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl opacity-40 pointer-events-none",
        className
      )}
      style={style}
    />
  );
}

export function DecorativeBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large primary blob - top right */}
      <Blob
        className="w-[400px] h-[400px] bg-gradient-to-br from-primary/30 to-chart-1/20 animate-blob-float"
        style={{ top: "-100px", right: "-100px" }}
      />
      
      {/* Medium accent blob - bottom left */}
      <Blob
        className="w-[300px] h-[300px] bg-gradient-to-tr from-accent/50 to-primary/20 animate-blob-float-delayed"
        style={{ bottom: "10%", left: "-80px" }}
      />
      
      {/* Small decorative blob - center right */}
      <Blob
        className="w-[200px] h-[200px] bg-gradient-to-bl from-chart-2/25 to-accent/30 animate-blob-pulse"
        style={{ top: "40%", right: "5%" }}
      />
      
      {/* Tiny accent blob - top left */}
      <Blob
        className="w-[150px] h-[150px] bg-gradient-to-r from-primary/25 to-chart-1/30 animate-blob-float-slow"
        style={{ top: "15%", left: "10%" }}
      />
      
      {/* Bottom right decorative */}
      <Blob
        className="w-[250px] h-[250px] bg-gradient-to-tl from-chart-1/20 to-primary/15 animate-blob-pulse-delayed"
        style={{ bottom: "5%", right: "15%" }}
      />

      {/* 3D-style shapes */}
      <div 
        className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm rotate-12 animate-shape-float shadow-lg"
        style={{ top: "20%", right: "20%" }}
      />
      <div 
        className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-chart-1/25 to-chart-2/10 backdrop-blur-sm animate-shape-float-delayed shadow-md"
        style={{ top: "60%", left: "15%" }}
      />
      <div 
        className="absolute w-10 h-10 rounded-xl bg-gradient-to-br from-accent/40 to-accent/10 backdrop-blur-sm -rotate-12 animate-shape-float-slow shadow-md"
        style={{ bottom: "25%", right: "10%" }}
      />
      <div 
        className="absolute w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-chart-1/20 backdrop-blur-sm rotate-45 animate-shape-pulse shadow-sm"
        style={{ top: "35%", left: "8%" }}
      />
    </div>
  );
}
