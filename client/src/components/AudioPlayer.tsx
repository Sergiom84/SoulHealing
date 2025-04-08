import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Timer, RotateCcw, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
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
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling audio:", error);
      }
    }
  }, [isPlaying, setIsPlaying, audioRef]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, []);

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const changeSpeed = (increment: number) => {
    const newRate = Math.min(Math.max(playbackRate + increment, 0.1), 2);
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleTimeUpdate);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("loadedmetadata", handleTimeUpdate);
        }
      };
    }
  }, [handleTimeUpdate, audioRef, volume]);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {title && <h3 className="text-lg font-medium text-center">{title}</h3>}
        
        <div className="flex items-center justify-center gap-4">
          <Button onClick={skipBackward}>
            <ChevronLeft /> 10s
          </Button>
          <Button onClick={togglePlayPause}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <Button onClick={skipForward}>
            10s <ChevronRight />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <Slider
            value={[progress]}
            max={duration}
            onValueChange={handleProgressChange}
            className="w-full"
          />
          <span>{Math.floor(progress)} / {Math.floor(duration)} s</span>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <Button onClick={() => changeSpeed(-0.1)}>
            <RotateCcw /> -0.1x
          </Button>
          <span>{playbackRate.toFixed(1)}x</span>
          <Button onClick={() => changeSpeed(0.1)}>
            <RotateCw /> +0.1x
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <Volume2 />
          <Slider
            value={[volume]}
            max={100}
            onValueChange={(value) => setVolume(value[0])}
            className="w-32"
          />
          <span>{volume}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
