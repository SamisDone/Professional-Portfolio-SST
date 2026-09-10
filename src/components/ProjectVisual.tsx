import type { ProjectArt } from "../data/content";

type Props = {
  art: ProjectArt;
  className?: string;
};

// Small inline line-art motifs, one per project — no stock imagery, so each
// card gets a visual that's actually about the thing it's describing.
function Glyph({ art }: { art: ProjectArt }) {
  const gid = `grad-${art}`;
  const stroke = `url(#${gid})`;

  switch (art) {
    case "medihub":
      return (
        <>
          <path
            d="M20 100h30l12-38 16 70 14-52 10 20h78"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M100 44v22M89 55h22"
            stroke={stroke}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="55" r="26" stroke={stroke} strokeWidth="1.5" fill="none" opacity="0.4" />
        </>
      );
    case "riphours":
      return (
        <>
          <circle cx="100" cy="100" r="56" stroke={stroke} strokeWidth="2.5" fill="none" opacity="0.35" />
          <path
            d="M100 100 A56 56 0 0 1 144 62"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M100 68v34l24 14"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="100" cy="100" r="4" fill="url(#grad-riphours)" />
        </>
      );
    case "pierra":
      return (
        <>
          <path
            d="M34 150V96l30-20 30 20v54M120 150V70l24-16 24 16v80"
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M20 150h160" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          {[46, 64].map((y) => (
            <line key={y} x1="50" y1={y} x2="78" y2={y} stroke={stroke} strokeWidth="1.5" opacity="0.5" />
          ))}
          {[110, 126, 142].map((y) => (
            <line key={y} x1="132" y1={y} x2="156" y2={y} stroke={stroke} strokeWidth="1.5" opacity="0.5" />
          ))}
        </>
      );
    case "stockmaster":
      return (
        <>
          {[
            [50, 60], [100, 44], [150, 60],
            [50, 110], [100, 94], [150, 110],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x - 22}
              y={y}
              width="44"
              height="40"
              rx="3"
              stroke={stroke}
              strokeWidth="2"
              fill="none"
              opacity={i === 4 ? 1 : 0.45}
            />
          ))}
        </>
      );
    case "tabsaver":
      return (
        <>
          <rect x="30" y="46" width="140" height="100" rx="8" stroke={stroke} strokeWidth="2.5" fill="none" />
          <path d="M30 70h140" stroke={stroke} strokeWidth="2" opacity="0.5" />
          {[52, 84, 116].map((x, i) => (
            <rect
              key={x}
              x={x}
              y="52"
              width="26"
              height="12"
              rx="3"
              stroke={stroke}
              strokeWidth="1.5"
              fill={i === 0 ? "url(#grad-tabsaver)" : "none"}
              opacity={i === 0 ? 0.9 : 0.5}
            />
          ))}
          <path d="M48 100h60M48 116h84" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </>
      );
    case "resumeforge":
      return (
        <>
          <rect x="52" y="36" width="96" height="128" rx="6" stroke={stroke} strokeWidth="2.5" fill="none" />
          <path d="M68 60h64M68 76h64M68 92h40" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <circle cx="100" cy="128" r="20" stroke={stroke} strokeWidth="2.5" fill="none" />
          <path d="M91 128l6 7 13-15" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      );
    case "financetracker":
      return (
        <>
          {[
            [48, 100], [78, 76], [108, 116], [138, 56], [160, 40],
          ].map(([x, h], i) => (
            <rect
              key={i}
              x={x - 10}
              y={150 - h}
              width="20"
              height={h}
              rx="2"
              fill="url(#grad-financetracker)"
              opacity={0.25 + i * 0.12}
            />
          ))}
          <path
            d="M40 108 L78 82 L108 122 L138 60 L166 42"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "roundrobin":
      return (
        <>
          <circle cx="100" cy="100" r="54" stroke={stroke} strokeWidth="2" opacity="0.3" fill="none" />
          {[0, 90, 180, 270].map((deg, i) => {
            const r1 = 54;
            const a0 = (deg * Math.PI) / 180;
            const a1 = ((deg + 78) * Math.PI) / 180;
            const x0 = 100 + r1 * Math.cos(a0);
            const y0 = 100 + r1 * Math.sin(a0);
            const x1 = 100 + r1 * Math.cos(a1);
            const y1 = 100 + r1 * Math.sin(a1);
            return (
              <path
                key={i}
                d={`M ${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1}`}
                fill="none"
                stroke={stroke}
                strokeWidth="6"
                strokeLinecap="round"
                opacity={i === 1 ? 1 : 0.4}
              />
            );
          })}
          <circle cx="100" cy="100" r="14" fill="none" stroke={stroke} strokeWidth="2" />
        </>
      );
    case "sortnplay":
      return (
        <>
          {[36, 62, 50, 82, 108, 96, 132, 150].map((h, i) => (
            <rect
              key={i}
              x={30 + i * 18}
              y={150 - h}
              width="12"
              height={h}
              rx="2"
              fill={i === 2 || i === 5 ? "url(#grad-sortnplay)" : "none"}
              stroke={stroke}
              strokeWidth="2"
              opacity={i === 2 || i === 5 ? 0.9 : 0.4}
            />
          ))}
        </>
      );
    case "microops":
      return (
        <>
          <path
            d="M76 66 L48 100 L76 134M124 66 L152 100 L124 134"
            fill="none"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M106 54 L88 108 L102 108 L94 148 L128 92 L112 92 Z"
            fill="url(#grad-microops)"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </>
      );
  }
}

export default function ProjectVisual({ art, className = "" }: Props) {
  const gid = `grad-${art}`;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 30% 20%, hsl(0 0% 14%) 0%, hsl(0 0% 6%) 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#89AACC" />
            <stop offset="100%" stopColor="#4E85BF" />
          </linearGradient>
        </defs>
        <Glyph art={art} />
      </svg>
    </div>
  );
}
