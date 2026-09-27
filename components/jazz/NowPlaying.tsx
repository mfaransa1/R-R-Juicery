"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  label: string;
  durationLabel: string;
  audio: string;
  artwork: string;
};

const TRACKS: Track[] = [
  {
    id: "reed-01",
    title: "Nairobi After Dark",
    artist: "The Reed",
    label: "R&R Listening Selection",
    durationLabel: "04:32",
    audio: "/audio/jazz/nairobi-after-dark.mp3",
    artwork: "/images/jazz/now-playing.jpg",
  },
  {
    id: "reed-02",
    title: "Sunday at the House",
    artist: "The Reed",
    label: "Sunday Session",
    durationLabel: "05:18",
    audio: "/audio/jazz/sunday-at-the-house.mp3",
    artwork: "/images/jazz/reed-room.jpg",
  },
  {
    id: "reed-03",
    title: "Late Afternoon Reed",
    artist: "The Reed",
    label: "House Selection",
    durationLabel: "03:56",
    audio: "/audio/jazz/late-afternoon-reed.mp3",
    artwork: "/images/jazz/now-playing.jpg",
  },
];

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "00:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

export default function NowPlaying() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const track = TRACKS[trackIndex];

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);

    if (playing) {
      void audio.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [trackIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        void togglePlayback();
      }

      if (event.code === "ArrowLeft") {
        skipBy(-10);
      }

      if (event.code === "ArrowRight") {
        skipBy(10);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
      setAudioError(false);
    } catch {
      setPlaying(false);
      setAudioError(true);
    }
  }

  function selectTrack(index: number) {
    setTrackIndex(index);
    setPlaying(true);
  }

  function previousTrack() {
    if (currentTime > 3) {
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    setTrackIndex((index) => (index - 1 + TRACKS.length) % TRACKS.length);
    setPlaying(true);
  }

  function nextTrack() {
    setTrackIndex((index) => (index + 1) % TRACKS.length);
    setPlaying(true);
  }

  function skipBy(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      audio.duration || Infinity,
    );
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(audio.duration)) return;

    audio.currentTime = value;
    setCurrentTime(value);
  }

  function handleVolume(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setVolume(value);

    if (value > 0) setMuted(false);
  }

  return (
    <section
      id="now-playing"
      className="overflow-hidden bg-[#111] py-24 text-white lg:py-36"
    >
      <audio
        ref={audioRef}
        src={track.audio}
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setAudioError(false);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={nextTrack}
        onError={() => {
          setAudioError(true);
          setPlaying(false);
        }}
      />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              NOW PLAYING
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              The
              <br />
              Reed.
            </h2>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-white/60">
              A rotating listening culture inspired by jazz, African sounds,
              records, musicians and the mood of the room.
            </p>

            <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-white/30">
              SPACE · PLAY · LISTEN
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-square overflow-hidden bg-[#292929]">
              <Image
                src={track.artwork}
                alt={`${track.title} artwork`}
                fill
                priority
                className="object-cover transition-transform duration-700"
                style={{ transform: playing ? "scale(1.035)" : "scale(1)" }}
              />

              <div className="absolute inset-0 bg-black/15" />

              <div
                className={`absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 ${
                  playing
                    ? "animate-[spin_10s_linear_infinite]"
                    : ""
                }`}
                aria-hidden="true"
              >
                <div className="absolute inset-8 rounded-full border border-white/20" />
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>

              <button
                type="button"
                onClick={() => void togglePlayback()}
                className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center bg-white !text-black transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label={playing ? "Pause music" : "Play music"}
              >
                {playing ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </button>
            </div>

            <div className="flex flex-col border border-white/15 p-7 sm:p-10">
              <div>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                      CURRENT RECORD
                    </p>

                    <h3 className="mt-5 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">
                      {track.title}
                    </h3>

                    <p className="mt-3 text-sm uppercase tracking-[0.16em] text-white/40">
                      {track.artist} · {track.label}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="hidden border border-white/15 p-2 text-white/55 transition hover:border-white hover:text-white sm:block"
                    aria-label={expanded ? "Collapse queue" : "Expand queue"}
                    aria-expanded={expanded}
                  >
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                <div className="mt-8 h-px bg-white/10" />

                <div className="mt-7">
                  <div className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/30">
                    <span>{formatTime(currentTime)}</span>
                    <span>
                      {duration ? formatTime(duration) : track.durationLabel}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(currentTime, duration || 0)}
                    onChange={handleSeek}
                    disabled={!duration}
                    className="rr-audio-range w-full"
                    style={{
                      background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,.14) ${progress}%)`,
                    }}
                    aria-label="Track progress"
                  />
                </div>

                {audioError && (
                  <div className="mt-5 border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-white/55">
                    <span className="text-white">Audio file not available yet.</span>{" "}
                    Add the track at{" "}
                    <code className="text-white/75">{track.audio}</code> to enable
                    playback.
                  </div>
                )}
              </div>

              <div className="mt-auto pt-10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={previousTrack}
                    className="border border-white/20 p-3 transition hover:border-white focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous track"
                  >
                    <SkipBack size={15} strokeWidth={1.5} />
                  </button>

                  <button
                    type="button"
                    onClick={() => void togglePlayback()}
                    className="flex h-12 w-12 items-center justify-center bg-white !text-black transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={nextTrack}
                    className="border border-white/20 p-3 transition hover:border-white focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next track"
                  >
                    <SkipForward size={15} strokeWidth={1.5} />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMuted((value) => !value)}
                      className="p-2 text-white/60 transition hover:text-white"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted || volume === 0 ? (
                        <VolumeX size={16} />
                      ) : (
                        <Volume2 size={16} />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={muted ? 0 : volume}
                      onChange={handleVolume}
                      className="rr-audio-range w-20"
                      style={{
                        background: `linear-gradient(to right, white ${
                          (muted ? 0 : volume) * 100
                        }%, rgba(255,255,255,.14) ${
                          (muted ? 0 : volume) * 100
                        }%)`,
                      }}
                      aria-label="Volume"
                    />
                  </div>
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="flex w-full items-center justify-between text-left text-[10px] uppercase tracking-[0.25em] text-white/40 transition hover:text-white sm:hidden"
                    aria-expanded={expanded}
                  >
                    <span>Listening queue</span>
                    {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  <div
                    className={`${
                      expanded ? "mt-4 block" : "hidden"
                    } sm:mt-7 sm:block`}
                  >
                    <div className="space-y-1">
                      {TRACKS.map((item, index) => {
                        const active = index === trackIndex;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectTrack(index)}
                            className={`group flex w-full items-center gap-4 border-b border-white/10 py-3 text-left transition ${
                              active
                                ? "text-white"
                                : "text-white/40 hover:text-white"
                            }`}
                          >
                            <span className="w-5 text-[10px] tracking-[0.15em]">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm">
                                {item.title}
                              </span>
                              <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-white/25">
                                {item.artist}
                              </span>
                            </span>

                            <span className="text-[10px] text-white/25">
                              {item.durationLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
