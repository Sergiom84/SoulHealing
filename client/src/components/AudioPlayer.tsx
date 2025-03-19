import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Timer } from "lucide-react";
import { type RefObject, useCallback } from "react";

interface AudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  audioRef: RefObject<HTMLAudioElement>;
}

export default function AudioPlayer({
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  playbackRate,
  setPlaybackRate,
  audioRef,
}: AudioPlayerProps) {
  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  }, [isPlaying, audioRef]);

  const toggleSpeed = useCallback(() => {
    setPlaybackRate(playbackRate === 1 ? 0.5 : 1);
  }, [playbackRate, setPlaybackRate]);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium">Escucha la lección.</h3>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSpeed}
            className={playbackRate === 0.5 ? "bg-accent" : ""}
          >
            <Timer className="h-4 w-4" />
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