import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium">Meditación Guiada</h3>
          <p className="text-sm text-muted-foreground">
            Escucha la lección mientras meditas
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <div className="flex items-center gap-2 w-48">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(vals) => setVolume(vals[0])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
