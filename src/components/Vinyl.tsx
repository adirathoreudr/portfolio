"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { useLenis } from "lenis/react";
import type { SpotifyPayload } from "@/lib/spotify";

type Note = { id: number; char: string; x: number; drift: number; dur: number; size: number };

const NOTE_CHARS = ["♪", "♫", "♩", "♬"];

function Disc({ spinning, fast, className }: { spinning: boolean; fast: boolean; className?: string }) {
  const rotate = useMotionValue(0);
  const speed = useRef(40);
  useAnimationFrame((_, delta) => {
    if (!spinning) return;
    const target = fast ? 200 : 40;
    speed.current += (target - speed.current) * 0.05;
    rotate.set((rotate.get() + (speed.current * delta) / 1000) % 360);
  });
  return (
    <motion.div
      style={{
        rotate,
        background:
          "repeating-radial-gradient(circle at 50% 50%, #161514 0px, #221f1e 1.5px, #0d0c0b 3px)",
      }}
      className={`relative rounded-full shadow-[0_10px_40px_rgba(10,10,9,0.45)] ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 40deg, rgba(244,241,234,0.10), transparent 22%, transparent 48%, rgba(244,241,234,0.07) 62%, transparent 80%)",
        }}
      />
      <div className="absolute inset-[31%] flex items-center justify-center rounded-full bg-blood">
        <span className="font-serif text-[0.55em] italic text-paper">AR</span>
        <span className="absolute size-[12%] rounded-full bg-bone" />
      </div>
    </motion.div>
  );
}

function TrackRow({ title, artist, art, url, index }: { title: string; artist: string; art: string; url: string; index?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 border-t border-smoke/50 py-2.5 first:border-t-0"
    >
      {index && <span className="w-5 font-serif text-xs italic text-crimson">{index}</span>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art} alt="" width={38} height={38} className="size-[38px] shrink-0 border border-smoke/60 object-cover" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-paper group-hover:text-crimson">{title}</span>
        <span className="block truncate text-xs text-ash">{artist}</span>
      </span>
    </a>
  );
}

export default function Vinyl() {
  const lenis = useLenis();
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [data, setData] = useState<SpotifyPayload | null>(null);
  const noteId = useRef(0);

  useEffect(() => {
    if (!hovered || open) return;
    const spawn = () => {
      const id = noteId.current++;
      setNotes((n) => [
        ...n.slice(-12),
        {
          id,
          char: NOTE_CHARS[id % NOTE_CHARS.length],
          x: Math.random() * 90 - 45,
          drift: Math.random() * 50 - 25,
          dur: 1.2 + Math.random() * 0.8,
          size: 14 + Math.random() * 12,
        },
      ]);
    };
    spawn();
    const t = setInterval(spawn, 200);
    return () => clearInterval(t);
  }, [hovered, open]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    const t = setInterval(refresh, 30000);
    const onKey = (e: KeyboardEvent) => e.code === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      clearInterval(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, refresh, lenis]);

  return (
    <>
      <div className="relative">
        <AnimatePresence>
          {notes.map((n) => (
            <motion.span
              key={n.id}
              initial={{ opacity: 0, y: 0, x: n.x, rotate: 0 }}
              animate={{ opacity: [0, 1, 0], y: -110, x: n.x + n.drift, rotate: n.drift }}
              exit={{ opacity: 0 }}
              transition={{ duration: n.dur, ease: "easeOut" }}
              onAnimationComplete={() => setNotes((cur) => cur.filter((m) => m.id !== n.id))}
              className="pointer-events-none absolute left-1/2 top-2 z-10 select-none"
              style={{ fontSize: n.size, color: n.id % 3 === 0 ? "#b1121b" : "#0a0a09" }}
              aria-hidden
            >
              {n.char}
            </motion.span>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(true)}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open the liner notes — what's spinning on Spotify"
          className="block cursor-pointer rounded-full text-[2.7rem] sm:text-[3.2rem]"
        >
          <Disc spinning fast={hovered} className="size-40 sm:size-52" />
        </motion.button>
        <p className="mt-3 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-smoke">
          Now spinning · tap the record
        </p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ scale: 0.55, opacity: 0, y: 60, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-smoke bg-[#0d0c0b] text-[1rem] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-smoke/70 px-5 py-3">
                <div className="flex items-center gap-3">
                  <Disc spinning fast={false} className="size-8 text-[0.5rem]" />
                  <h3 className="font-serif text-lg italic text-paper sm:text-xl">The Liner Notes</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash max-sm:hidden">
                    via Spotify · live
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close liner notes"
                    className="font-mono text-sm text-ash transition-colors hover:text-crimson"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div
                data-lenis-prevent
                className="grain relative flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6"
              >
                {!data ? (
                  <div className="flex flex-col items-center gap-4 py-16">
                    <Disc spinning fast className="size-16 text-[0.8rem]" />
                    <p className="font-serif italic text-ash">Dropping the needle…</p>
                  </div>
                ) : !data.configured ? (
                  <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <Disc spinning fast={false} className="size-16 text-[0.8rem]" />
                    <p className="font-serif text-xl italic text-paper">
                      This record is still being pressed.
                    </p>
                    <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
                      The needle drops once Spotify is wired up. Check back soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {data.nowPlaying && (
                      <a
                        href={data.nowPlaying.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-5 border border-smoke/60 bg-ink/60 p-4"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={data.nowPlaying.art} alt="" width={72} height={72} className="size-[72px] shrink-0 border border-smoke object-cover" />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-crimson">
                            {data.isPlaying && (
                              <motion.span
                                aria-hidden
                                className="size-1.5 rounded-full bg-crimson"
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1.4, repeat: Infinity }}
                              />
                            )}
                            {data.isPlaying ? "Now playing" : "Last played"}
                          </span>
                          <span className="mt-1 block truncate font-serif text-xl italic text-paper group-hover:text-crimson sm:text-2xl">
                            {data.nowPlaying.title}
                          </span>
                          <span className="block truncate text-sm text-ash">{data.nowPlaying.artist}</span>
                        </span>
                      </a>
                    )}

                    <div className="grid gap-8 sm:grid-cols-2">
                      <div>
                        <p className="border-b-2 border-crimson pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-paper">
                          Recents
                        </p>
                        <div className="mt-2">
                          {data.recents.map((t, i) => (
                            <TrackRow key={`${t.title}${i}`} {...t} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="border-b-2 border-crimson pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-paper">
                          Fav Albums
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          {data.favAlbums.map((al) => (
                            <a
                              key={al.name}
                              href={al.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={al.art} alt="" width={160} height={160} className="aspect-square w-full border border-smoke/60 object-cover" />
                              <span className="mt-2 block truncate text-sm font-semibold text-paper group-hover:text-crimson">
                                {al.name}
                              </span>
                              <span className="block truncate text-xs text-ash">
                                {al.artist}
                                {al.plays ? ` · ${al.plays} plays` : ""}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="border-b-2 border-crimson pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-paper">
                        On Repeat
                      </p>
                      <div className="mt-2">
                        {data.onRepeat.map((t, i) => (
                          <TrackRow key={`${t.title}${i}`} {...t} index={`0${i + 1}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-smoke/50 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ash">
                <span>Side A · 33⅓ RPM</span>
                <span>Esc to lift the needle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
