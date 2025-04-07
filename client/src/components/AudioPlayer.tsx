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
  audioRef: RefObject<HTMLAudioElement | null>;
  title?: string;
}

export default function AudioPlayer({
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  playbackRate,
  setPlaybackRate,
  audioRef,
  title,
}: AudioPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = useCallback(async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Error toggling audio:", error);
      }
    }
  }, [isPlaying, audioRef]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
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

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {title && <h3 className="text-lg font-medium text-center">{title}</h3>}
        <div className="flex items-center justify-center gap-4">
          <Button onClick={togglePlayPause}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <span>{Math.floor(progress)} / {Math.floor(duration)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
