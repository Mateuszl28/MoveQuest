"use client";

import {
  Activity, Bike, Clock, Crown, Droplets, Dumbbell, Flame, Flower2, Footprints,
  Heart, ListChecks, MapPin, Moon, Shield, Sparkles, Star, Swords, TrendingUp,
  Trophy, Wind, Zap, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Activity, Bike, Clock, Crown, Droplets, Dumbbell, Flame, Flower2, Footprints,
  Heart, ListChecks, MapPin, Moon, Shield, Sparkles, Star, Swords, TrendingUp,
  Trophy, Wind, Zap,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = MAP[name] ?? Sparkles;
  return <C className={className} />;
}
