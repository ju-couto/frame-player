import Image, { StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiPause1, CiPlay1 } from "react-icons/ci";

interface FramePlayerProps {
  frames: StaticImageData[];
  fps: number;
}

export const FramePlayer = ({ frames, fps }: FramePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const duration = 1000 / fps;
  const totalFrames = frames.length;
  const totalTime = totalFrames * duration;

  const updateProgress = useCallback(() => {
    if (startTime === null) return;

    const timePassed = Date.now() - startTime;
    const currentTimeInSeconds = Math.min(timePassed / 1000, totalTime / 1000);
    const newFrame = Math.min(Math.floor(timePassed / duration), totalFrames - 1);
    const newProgress = (currentTimeInSeconds / (totalTime / 1000)) * 100;

    setCurrentFrame(newFrame);
    setProgress(newProgress);
    setCurrentTime(currentTimeInSeconds);

    if (currentTimeInSeconds >= totalTime / 1000) {
      setIsPlaying(false);
    }
  }, [duration, totalFrames, startTime, totalTime]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateProgress, 100);
    } else {
      clearInterval(intervalRef.current ?? undefined);
    }
    return () => clearInterval(intervalRef.current ?? undefined);
  }, [isPlaying, updateProgress]);

  const startPlaying = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  const stopPlaying = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current ?? undefined);
  };

  const handleProgressClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * totalTime;
    const newFrame = Math.min(Math.floor(newTime / duration), totalFrames - 1);

    setCurrentFrame(newFrame);
    setProgress(newProgress);
    setCurrentTime(newTime / 1000);

    setStartTime(Date.now() - newTime);
    
  };

  return (
    <div className="relative group flex flex-col items-center w-[640px]">
      <div className="mb-4 w-full relative">
        <Image
          src={frames[currentFrame]}
          alt={`Frame ${currentFrame + 1}`}
          width={640}
          height={480}
          className="block w-[640px] h-[480px]"
        />
        <div className="hidden group-hover:flex absolute inset-0 items-center justify-center">
          <button onClick={isPlaying ? stopPlaying : startPlaying} className="p-1  bg-stone-800	rounded-md shadow-lg text-3xl">
            {isPlaying ? <CiPause1 /> : <CiPlay1 />}
          </button>
        </div>
      </div>
      <div className="flex items-center w-full">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressClick}
          className="w-full"
        />
      </div>
      <div className="flex justify-between w-full text-sm text-gray-500">
        <span>{currentTime.toFixed(2)}s / {(totalTime / 1000).toFixed(2)}s</span>
      </div>
    </div>
  );
};
