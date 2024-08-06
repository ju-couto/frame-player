"use client";
import { FramePlayer } from "@/components/FramePlayer";

import frame1 from "../assets/frame1.jpeg";
import frame2 from "../assets/frame2.jpg";
import frame3 from "../assets/frame3.jpg";
import frame4 from "../assets/frame4.jpeg";
import frame5 from "../assets/frame5.jpg";
export default function Home() {

  const frames = [frame1, frame2, frame3, frame4, frame5];
  const fps = 0.2
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <FramePlayer frames={frames} fps={fps} />
    </div>
  );
}
