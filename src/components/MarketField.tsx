import { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { marketField } from '@/theme';

/**
 * The "Market Field" — DemandOne's one ownable abstract graphic. A fine halftone
 * dot grid, color interpolated across forest → amber → rust → charcoal, with a
 * couple of denser "concentration" clusters. Built from plain `View`s (same
 * technique as the small `DotScatter` in domain.tsx, just generalized) — no SVG or
 * gradient library, so it costs nothing to add.
 *
 * Conceptually: individual dots = market participants, concentrations = liquidity,
 * two fields placed near each other = a potential match. None of that is ever
 * explained in the product — it just gives the texture internal consistency.
 */

interface Dot {
  x: number;
  y: number;
  r: number;
  color: string;
  o: number;
}

const STOPS = [marketField.forest, marketField.amber, marketField.rust, marketField.charcoal];

function hashRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function mixHex(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 255;
  const ag = (ah >> 8) & 255;
  const ab = ah & 255;
  const br = (bh >> 16) & 255;
  const bg = (bh >> 8) & 255;
  const bb = bh & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function interpolate(t: number): string {
  const n = STOPS.length - 1;
  const seg = Math.min(n - 1, Math.max(0, Math.floor(t * n)));
  const localT = t * n - seg;
  return mixHex(STOPS[seg], STOPS[seg + 1], localT);
}

export function MarketField({
  width,
  height,
  dotCount = 260,
  intensity = 0.5,
  style,
}: {
  width: number;
  height: number;
  /** Total dot budget — callers size this to the area, not derived automatically, so it stays bounded. */
  dotCount?: number;
  /** 0–1: how prominent the liquidity concentrations read — denser/larger for high-intensity moments. */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const dots = useMemo((): Dot[] => {
    const aspect = width / Math.max(1, height);
    const cols = Math.max(6, Math.round(Math.sqrt(dotCount * aspect)));
    const rows = Math.max(4, Math.round(dotCount / cols));
    const centers = [
      { cx: 0.28 + hashRandom(11) * 0.18, cy: 0.35 + hashRandom(12) * 0.2 },
      { cx: 0.68 + hashRandom(13) * 0.18, cy: 0.62 + hashRandom(14) * 0.2 },
    ];
    const result: Dot[] = [];
    let i = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        i += 1;
        const px = (col + 0.5) / cols;
        const py = (row + 0.5) / rows;
        const jitterX = (hashRandom(i * 2) - 0.5) * (width / cols) * 0.6;
        const jitterY = (hashRandom(i * 3) - 0.5) * (height / rows) * 0.6;
        const t = Math.min(1, Math.max(0, px * 0.7 + py * 0.3));

        let boost = 0;
        for (const c of centers) {
          const d = Math.hypot(px - c.cx, py - c.cy);
          boost = Math.max(boost, Math.max(0, 1 - d * 2.2));
        }
        const noise = hashRandom(i);
        const r = 1 + noise * 1.5 + boost * 2.2 * intensity;
        const o = Math.min(0.9, 0.22 + noise * 0.32 + boost * 0.28 * intensity);

        result.push({ x: px * width + jitterX, y: py * height + jitterY, r, color: interpolate(t), o });
      }
    }
    return result;
  }, [width, height, dotCount, intensity]);

  return (
    <View style={[{ width, height, overflow: 'hidden' }, style]} pointerEvents="none">
      {dots.map((d, idx) => (
        <View
          key={idx}
          style={{
            position: 'absolute',
            left: d.x - d.r,
            top: d.y - d.r,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: d.r,
            backgroundColor: d.color,
            opacity: d.o,
          }}
        />
      ))}
    </View>
  );
}
