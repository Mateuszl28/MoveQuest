"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { dateKey } from "@/lib/utils";

export function XpChart({ xpHistory }: { xpHistory: Record<string, number> }) {
  const today = new Date();
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = dateKey(d);
    return {
      label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
      xp: xpHistory[key] ?? 0,
      isToday: key === dateKey(today),
    };
  });
  const total = data.reduce((s, d) => s + d.xp, 0);

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display font-bold">This week&apos;s XP</h3>
        <span className="text-sm font-semibold text-gold">{total.toLocaleString()} XP</span>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: "#9b94c7", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "#181430",
                border: "1px solid #2a2350",
                borderRadius: 12,
                color: "#ECEAFB",
                fontSize: 12,
              }}
              labelStyle={{ color: "#9b94c7" }}
              formatter={(v: number) => [`${v} XP`, "Earned"]}
            />
            <defs>
              <linearGradient id="xpBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <Bar dataKey="xp" radius={[6, 6, 0, 0]} isAnimationActive>
              {data.map((d, i) => (
                <Cell key={i} fill={d.isToday ? "#fbbf24" : "url(#xpBar)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
