"use client";

interface PlaceholderImageProps {
  type: "chart" | "profit" | "ea" | "trader" | "dashboard";
  className?: string;
  label?: string;
}

function ChartPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900/50 to-emerald-950/50 ${className}`}>
      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgb(16,185,129)" strokeOpacity="0.1" strokeWidth="1" />
        ))}
        {/* Candlesticks */}
        {[30, 70, 110, 150, 190, 230, 270, 310, 350].map((x, i) => {
          const isGreen = i % 3 !== 0;
          const bodyTop = 60 + Math.sin(i * 0.8) * 30;
          const bodyHeight = 20 + Math.random() * 20;
          return (
            <g key={x}>
              <line x1={x} y1={bodyTop - 15} x2={x} y2={bodyTop + bodyHeight + 15} stroke={isGreen ? "rgb(16,185,129)" : "rgb(239,68,68)"} strokeWidth="1" />
              <rect x={x - 8} y={bodyTop} width="16" height={bodyHeight} fill={isGreen ? "rgb(16,185,129)" : "rgb(239,68,68)"} rx="2" />
            </g>
          );
        })}
        {/* Trend line */}
        <path d="M0,150 Q100,120 200,100 T400,40" fill="none" stroke="rgb(16,185,129)" strokeWidth="2" strokeDasharray="4,4" />
      </svg>
      <div className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] text-emerald-400 backdrop-blur-sm">
        XAUUSD • M15
      </div>
    </div>
  );
}

function ProfitPlaceholder({ className = "", profit = "+$2,450" }: { className?: string; profit?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 ${className}`}>
      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="profitBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(5,150,105)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#profitBg)" />
        {/* Balance line */}
        <path d="M0,160 Q50,155 100,150 T200,120 T300,80 T400,30" fill="none" stroke="rgb(16,185,129)" strokeWidth="3" />
        {/* Profit area */}
        <path d="M0,160 Q50,155 100,150 T200,120 T300,80 T400,30 L400,200 L0,200 Z" fill="url(#profitBg)" />
        {/* Grid */}
        {[50, 100, 150].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgb(16,185,129)" strokeOpacity="0.1" strokeWidth="1" />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-4xl font-bold text-emerald-400 drop-shadow-lg">{profit}</div>
          <div className="mt-1 text-xs text-emerald-300/70">Total Profit</div>
        </div>
      </div>
    </div>
  );
}

function EaPlaceholder({ className = "", name = "Phoenix EA" }: { className?: string; name?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gold/20 to-gold-deep/20 ${className}`}>
      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="eaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(212,175,55)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(180,130,20)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#eaGrad)" />
        {/* EA Icon */}
        <circle cx="200" cy="80" r="40" fill="none" stroke="rgb(212,175,55)" strokeWidth="2" />
        <path d="M180,80 L200,60 L220,80 L200,100 Z" fill="rgb(212,175,55)" fillOpacity="0.5" />
        {/* Stats */}
        <rect x="120" y="140" width="60" height="8" rx="4" fill="rgb(212,175,55)" fillOpacity="0.3" />
        <rect x="220" y="140" width="60" height="8" rx="4" fill="rgb(212,175,55)" fillOpacity="0.3" />
        <rect x="150" y="160" width="100" height="6" rx="3" fill="rgb(212,175,55)" fillOpacity="0.2" />
      </svg>
      <div className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] text-gold-light backdrop-blur-sm">
        {name}
      </div>
    </div>
  );
}

function TraderPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-700/50 to-zinc-900/50 ${className}`}>
      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="traderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(113,113,122)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(63,63,70)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#traderGrad)" />
        {/* Person icon */}
        <circle cx="200" cy="70" r="25" fill="rgb(161,161,170)" fillOpacity="0.5" />
        <path d="M150,120 Q150,95 200,95 Q250,95 250,120 L250,140 L150,140 Z" fill="rgb(161,161,170)" fillOpacity="0.5" />
        {/* Laptop */}
        <rect x="160" y="150" width="80" height="50" rx="4" fill="rgb(82,82,91)" fillOpacity="0.5" />
        <rect x="165" y="155" width="70" height="35" rx="2" fill="rgb(16,185,129)" fillOpacity="0.3" />
      </svg>
    </div>
  );
}

function DashboardPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 ${className}`}>
      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(82,82,91)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(38,38,38)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#dashGrad)" />
        {/* Dashboard panels */}
        <rect x="20" y="20" width="170" height="80" rx="8" fill="rgb(16,185,129)" fillOpacity="0.1" stroke="rgb(16,185,129)" strokeOpacity="0.2" />
        <rect x="210" y="20" width="170" height="80" rx="8" fill="rgb(212,175,55)" fillOpacity="0.1" stroke="rgb(212,175,55)" strokeOpacity="0.2" />
        <rect x="20" y="110" width="360" height="70" rx="8" fill="rgb(113,113,122)" fillOpacity="0.1" stroke="rgb(113,113,122)" strokeOpacity="0.2" />
        {/* Mini charts */}
        <path d="M30,80 Q60,70 90,75 T150,50" fill="none" stroke="rgb(16,185,129)" strokeWidth="2" />
        <path d="M220,80 Q250,65 280,70 T340,45" fill="none" stroke="rgb(212,175,55)" strokeWidth="2" />
        {/* Bars */}
        {[40, 100, 160, 220, 280, 340].map((x) => (
          <rect key={x} x={x} y={180 - Math.random() * 40} width="30" height={Math.random() * 40} rx="2" fill="rgb(113,113,122)" fillOpacity="0.3" />
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] text-zinc-400 backdrop-blur-sm">
        EA Dashboard
      </div>
    </div>
  );
}

export default function PlaceholderImage({ type, className = "", label }: PlaceholderImageProps) {
  switch (type) {
    case "chart":
      return <ChartPlaceholder className={className} />;
    case "profit":
      return <ProfitPlaceholder className={className} profit={label} />;
    case "ea":
      return <EaPlaceholder className={className} name={label} />;
    case "trader":
      return <TraderPlaceholder className={className} />;
    case "dashboard":
      return <DashboardPlaceholder className={className} />;
    default:
      return <ChartPlaceholder className={className} />;
  }
}
