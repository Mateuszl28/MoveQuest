"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { CharacterStats } from "@/lib/types";

export function StatRadar({ stats }: { stats: CharacterStats }) {
  const data = [
    { stat: "STR", value: stats.strength },
    { stat: "END", value: stats.endurance },
    { stat: "AGI", value: stats.agility },
    { stat: "CON", value: stats.consistency },
  ];
  const max = Math.max(10, ...data.map((d) => d.value));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#2a2350" />
          <PolarAngleAxis
            dataKey="stat"
            tick={{ fill: "#9b94c7", fontSize: 12, fontWeight: 600 }}
          />
          <Radar
            dataKey="value"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#radarFill)"
            fillOpacity={0.6}
            domain={[0, max]}
            isAnimationActive
          />
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
