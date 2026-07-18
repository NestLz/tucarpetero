const PALETTES = {
  magenta: { accent: "#E8306B", glow: "#A98FD4" },
  vio: { accent: "#7C5CFF", glow: "#A98FD4" },
};

// Fondo decorativo estilo tinta/cómic: masas de pincel irregulares sobre
// una explosión radial de color, con trazos lima sueltos encima.
export default function HeroArt({ variant = "magenta", opacity = 1, className = "" }) {
  const { accent, glow } = PALETTES[variant] ?? PALETTES.magenta;
  const gradId = `heroart-burst-${variant}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <defs>
        <radialGradient id={gradId} cx="78%" cy="18%" r="85%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="45%" stopColor={glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${gradId})`} />

      {/* masas de tinta tipo pincel */}
      <path
        d="M310,38 C342,18 382,32 388,68 C393,104 362,122 328,112 C298,103 276,76 288,54 C293,44 300,41 310,38 Z"
        fill="#0D0D12"
        opacity="0.92"
      />
      <path
        d="M258,138 C290,122 332,133 342,164 C352,196 320,222 284,216 C248,210 228,178 240,153 C245,143 250,140 258,138 Z"
        fill="#0D0D12"
        opacity="0.85"
      />
      <path
        d="M357,14 C368,6 380,11 382,22 C384,33 373,40 362,36 C351,32 347,21 357,14 Z"
        fill="#0D0D12"
        opacity="0.8"
      />
      <path
        d="M300,110 C306,132 296,162 288,192 C283,208 293,212 300,201 C310,180 314,148 307,118 Z"
        fill="#0D0D12"
        opacity="0.75"
      />
      <circle cx="372" cy="58" r="3" fill="#0D0D12" opacity="0.6" />
      <circle cx="252" cy="98" r="2" fill="#0D0D12" opacity="0.5" />
      <circle cx="322" cy="232" r="2.5" fill="#0D0D12" opacity="0.55" />

      {/* trazos sueltos lima */}
      <path
        d="M238,58 Q270,42 302,54"
        stroke="#9AAD3C"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      <path
        d="M330,182 Q356,170 378,186"
        stroke="#9AAD3C"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M268,232 Q290,220 312,236"
        stroke="#9AAD3C"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
