const W = 1440;
const H = 72;
const STEP = 16;

function jaggedPath(seed: number, base: number, amp: number) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const pts: string[] = [`M0 0`, `L0 ${base.toFixed(1)}`];
  for (let x = 0; x <= W; x += STEP) {
    const y = base + (rand() - 0.5) * amp + Math.sin(x / 130) * (amp * 0.35);
    pts.push(`L${x} ${Math.max(6, Math.min(H - 4, y)).toFixed(1)}`);
  }
  pts.push(`L${W} 0`, "Z");
  return pts.join(" ");
}

const PATH_MAIN = jaggedPath(7919, 38, 26);
const PATH_UNDER = jaggedPath(104729, 46, 24);

type TornEdgeProps = {
  fill: string;
  flip?: boolean;
  underFill?: string;
  className?: string;
};

export default function TornEdge({
  fill,
  flip = false,
  underFill = "#e8e4da",
  className = "",
}: TornEdgeProps) {
  return (
    <div
      aria-hidden
      className={`relative -my-px w-full overflow-hidden leading-none ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block h-10 w-full sm:h-14 md:h-[72px]"
      >
        <path d={PATH_UNDER} fill={underFill} opacity={0.9} />
        <path d={PATH_MAIN} fill={fill} />
      </svg>
    </div>
  );
}
