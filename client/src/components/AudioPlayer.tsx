import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Timer, RotateCcw, RotateCw } from "lucide-react";
import { type RefObject, useCallback, useEffect, useState } from "react";

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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  }, []);

  const skipTime = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, audioRef.current.duration));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleTimeUpdate);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleTimeUpdate);
        }
      };
    }
  }, [handleTimeUpdate]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium">Cierra los ojos y escucha.</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground w-12 text-right">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground w-12">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => skipTime(-10)}
              title="Retroceder 10 segundos"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

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
              onClick={() => skipTime(10)}
              title="Adelantar 10 segundos"
            >
              <RotateCw className="h-4 w-4" />
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
        </div>
      </CardContent>
    </Card>
  );
}