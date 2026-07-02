"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const W = 480;
const H = 300;
const GRAVITY = 1500;
const FLAP = -430;
const PIPE_SPEED = 155;
const PIPE_W = 52;
const GAP = 118;
const SPAWN_EVERY = 1.45;
const BIRD_X = 96;
const BIRD_R = 10;

type Pipe = { x: number; top: number; scored: boolean };
type Mode = "idle" | "run" | "dead";

type GameState = {
  mode: Mode;
  y: number;
  vy: number;
  pipes: Pipe[];
  spawnT: number;
  score: number;
  t: number;
};

function freshState(): GameState {
  return {
    mode: "idle",
    y: H / 2,
    vy: 0,
    pipes: [],
    spawnT: SPAWN_EVERY - 0.7,
    score: 0,
    t: 0,
  };
}

export default function FlappyTerminal() {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<GameState>(freshState());
  const bestRef = useRef(0);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem("flappy-best") || 0);
    bestRef.current = stored;
    setBest(stored);
  }, []);

  const flap = useCallback(() => {
    const g = game.current;
    if (g.mode === "idle") {
      g.mode = "run";
      g.vy = FLAP;
    } else if (g.mode === "run") {
      g.vy = FLAP;
    } else {
      game.current = { ...freshState(), mode: "run", vy: FLAP };
      setScore(0);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      } else if (e.code === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, flap]);

  useEffect(() => {
    if (!open) return;
    game.current = freshState();
    setScore(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.max(0, Math.min((now - last) / 1000, 0.035));
      last = now;
      const g = game.current;
      g.t += dt;

      if (g.mode === "run") {
        g.vy += GRAVITY * dt;
        g.y += g.vy * dt;
        g.spawnT += dt;
        if (g.spawnT >= SPAWN_EVERY) {
          g.spawnT = 0;
          const top = 36 + Math.random() * (H - GAP - 110);
          g.pipes.push({ x: W + PIPE_W, top, scored: false });
        }
        for (const p of g.pipes) {
          p.x -= PIPE_SPEED * dt;
          if (!p.scored && p.x + PIPE_W < BIRD_X - BIRD_R) {
            p.scored = true;
            g.score += 1;
            setScore(g.score);
          }
        }
        g.pipes = g.pipes.filter((p) => p.x > -PIPE_W - 4);

        const hitWall = g.y + BIRD_R > H - 14 || g.y - BIRD_R < 0;
        const hitPipe = g.pipes.some(
          (p) =>
            BIRD_X + BIRD_R > p.x &&
            BIRD_X - BIRD_R < p.x + PIPE_W &&
            (g.y - BIRD_R < p.top || g.y + BIRD_R > p.top + GAP)
        );
        if (hitWall || hitPipe) {
          g.mode = "dead";
          if (g.score > bestRef.current) {
            bestRef.current = g.score;
            setBest(g.score);
            window.localStorage.setItem("flappy-best", String(g.score));
          }
        }
      }

      ctx.fillStyle = "#070605";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(177,18,27,0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(0, H - 14);
      ctx.lineTo(W, H - 14);
      ctx.stroke();
      ctx.setLineDash([]);

      for (const p of g.pipes) {
        ctx.fillStyle = "#7a0e12";
        ctx.fillRect(p.x, 0, PIPE_W, p.top);
        ctx.fillRect(p.x, p.top + GAP, PIPE_W, H - 14 - (p.top + GAP));
        ctx.fillStyle = "#b1121b";
        ctx.fillRect(p.x, p.top - 8, PIPE_W, 8);
        ctx.fillRect(p.x, p.top + GAP, PIPE_W, 8);
      }

      const tilt = Math.max(-0.4, Math.min(0.6, g.vy / 700));
      ctx.save();
      ctx.translate(BIRD_X, g.y);
      ctx.rotate(g.mode === "idle" ? Math.sin(g.t * 4) * 0.1 : tilt);
      ctx.fillStyle = "#f4f1ea";
      ctx.fillRect(-BIRD_R, -BIRD_R, BIRD_R * 2, BIRD_R * 2);
      ctx.fillStyle = "#0a0a09";
      ctx.fillRect(2, -5, 4, 4);
      ctx.fillStyle = "#b1121b";
      ctx.fillRect(BIRD_R - 2, -2, 6, 4);
      ctx.restore();

      ctx.textAlign = "center";
      if (g.mode === "idle") {
        if (Math.floor(g.t * 2) % 2 === 0) {
          ctx.fillStyle = "#f4f1ea";
          ctx.font = "bold 14px monospace";
          ctx.fillText("PRESS SPACE OR TAP TO FLY", W / 2, H / 2 - 60);
        }
      } else if (g.mode === "dead") {
        ctx.fillStyle = "#b1121b";
        ctx.font = "bold 32px monospace";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 24);
        ctx.fillStyle = "#f4f1ea";
        ctx.font = "bold 14px monospace";
        ctx.fillText(
          `SCORE ${g.score}  ·  BEST ${bestRef.current}`,
          W / 2,
          H / 2 + 6
        );
        ctx.fillText("PRESS SPACE TO CONTINUE THE STORY", W / 2, H / 2 + 32);
      } else {
        ctx.fillStyle = "rgba(244,241,234,0.9)";
        ctx.font = "bold 28px monospace";
        ctx.fillText(String(g.score), W / 2, 44);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  return (
    <>
      <motion.button
        layoutId="arcade"
        onClick={() => setOpen(true)}
        aria-label="Open the arcade terminal"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full border border-crimson/70 bg-ink font-mono text-sm text-crimson shadow-[0_0_24px_rgba(177,18,27,0.35)] sm:bottom-8 sm:right-8"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-crimson/50"
          animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        ❯_
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              layoutId="arcade"
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative w-full max-w-[560px] overflow-hidden rounded-lg border border-smoke bg-[#0d0c0b] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-smoke/70 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close terminal"
                    className="size-3 rounded-full bg-crimson transition-transform hover:scale-125"
                  />
                  <span aria-hidden className="size-3 rounded-full bg-paper/30" />
                  <span aria-hidden className="size-3 rounded-full bg-smoke" />
                </div>
                <p className="font-mono text-[11px] text-ash">
                  guest@rathore — ~/arcade/flappy.sh
                </p>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close terminal"
                  className="font-mono text-xs text-ash transition-colors hover:text-crimson"
                >
                  ✕
                </button>
              </div>

              <div className="border-b border-smoke/50 px-4 py-2 font-mono text-[11px] sm:text-xs">
                <span className="text-crimson">$</span>{" "}
                <span className="text-paper/80">./flappy.sh</span>{" "}
                <span className="text-ash">--score</span>{" "}
                <span className="text-paper">{score}</span>{" "}
                <span className="text-ash">--best</span>{" "}
                <span className="text-paper">{best}</span>
                <motion.span
                  aria-hidden
                  className="ml-1 inline-block h-3 w-2 bg-crimson align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              <div className="scanlines relative">
                <canvas
                  ref={canvasRef}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    flap();
                  }}
                  className="block w-full touch-none select-none"
                  style={{ aspectRatio: `${W} / ${H}` }}
                />
              </div>

              <div className="flex items-center justify-between border-t border-smoke/50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ash">
                <span>Space / tap to flap</span>
                <span>Esc to exit</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
