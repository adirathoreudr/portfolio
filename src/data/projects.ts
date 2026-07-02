export type Project = {
  index: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  description: string;
  bullets: string[];
  stack: string[];
  href: string;
  live?: string;
  accent: "crimson" | "paper" | "ink";
};

export const projects: Project[] = [
  {
    index: "I",
    name: "RUG DNA",
    tagline: "Every token leaves evidence. Somebody has to read it.",
    category: "Onchain Forensics",
    year: "2026",
    description:
      "An AI-powered surveillance platform that watches token launches the way a detective watches a lighthouse — patiently, and expecting the worst.",
    bullets: [
      "Risk engine scoring tokens 0–100 across six behavioral signals — holder concentration, deployer history, liquidity depth, transfer velocity, mint/burn anomalies, wallet clustering — fed by GoldRush/Covalent onchain APIs.",
      "Forensic mode auto-compiles case files with transaction timelines and fund-extraction paths the moment a risk threshold is breached.",
      "Server-sent events stream a live alert feed into a Next.js 15 / React 19 front-end with Cytoscape.js wallet-graph visualization.",
    ],
    stack: ["Next.js 15", "TypeScript", "GoldRush API", "Cytoscape.js", "Vercel"],
    href: "https://github.com/adirathoreudr/rug-dna-live",
    live: "https://rug-dna-live.vercel.app",
    accent: "crimson",
  },
  {
    index: "II",
    name: "INCIDENT COMMANDER",
    tagline: "It makes your cluster an offer it can't refuse: heal, or be healed.",
    category: "AIOps / Kubernetes",
    year: "2026",
    description:
      "An autonomous incident responder that triages, reasons, and remediates production Kubernetes incidents — the family consigliere for your pagers.",
    bullets: [
      "LangChain reasoning agent with FAISS-backed RAG over runbooks and incident history, ingesting normalized alerts from Prometheus Alertmanager and Loki.",
      "Policy-gated execution layer: allowlisted remediations only (restart, scale, rollback) via the Kubernetes client and ArgoCD API, with approval gates and an append-only audit trail.",
      "Deployed on AWS EKS via Terraform with Redis dedup windows — 58% MTTR reduction, 67% auto-resolution in simulated scenarios.",
    ],
    stack: ["Python", "LangChain", "FAISS", "EKS", "Terraform", "Redis"],
    href: "https://github.com/adirathoreudr/aiops-incident-commander",
    accent: "paper",
  },
  {
    index: "III",
    name: "ZK EXTENSIONS",
    tagline: "A wardrobe between two worlds that were never meant to touch.",
    category: "Solana / Zero-Knowledge",
    year: "2026",
    description:
      "An AI-agent skill that bridges Light Protocol's ZK Compression with SPL Token-2022 Transfer Hooks — two primitives that couldn't speak until now.",
    bullets: [
      "Progressive-context skill architecture: a SKILL.md router selectively loads compressed-PDA templates, hook implementations, and mandatory security guardrails per query.",
      "Reconciles off-chain compressed state (Photon indexer validity proofs, ~99% rent reduction) with synchronous CPI transfer hooks that have no RPC access.",
      "Hardens agents against stale-root replay and double-spend across the bridge, with Rust/Anchor templates and a local Photon + prover test environment.",
    ],
    stack: ["Rust", "Anchor", "Light Protocol", "Photon", "TypeScript"],
    href: "https://github.com/adirathoreudr/solana-zk-extensions-skill",
    accent: "ink",
  },
  {
    index: "IV",
    name: "GHOST",
    tagline: "It doesn't coach you. It becomes you.",
    category: "Realtime Voice AI",
    year: "2026",
    description:
      "A real-time sales co-pilot that answers live objections in the rep's own cloned voice — the prospect never hears the second speaker.",
    bullets: [
      "Hold-to-speak pipeline: ElevenLabs Scribe STT captures the objection, NVIDIA NIM Llama 3.3 70B classifies it across five objection types, and Turbo v2.5 TTS answers in the rep's cloned voice.",
      "~1.8s end-to-end latency with system-level audio routing (BlackHole 2ch) so the response lands mid-conversation, seamlessly.",
      "React 18 + Zustand front-end with three selectable coach personas and post-call debriefs — full transcripts, classifications, and latency metrics.",
    ],
    stack: ["React 18", "Node.js", "ElevenLabs", "NVIDIA NIM", "Zustand"],
    href: "https://github.com/adirathoreudr/ghostProject",
    accent: "crimson",
  },
];
