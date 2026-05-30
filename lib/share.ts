export interface CardFields {
  username: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  cls: string;
  rank: string;
  badges: number;
}

/** Build the query string used by both /card and /api/card. */
export function cardQuery(f: CardFields): string {
  const p = new URLSearchParams({
    u: f.username,
    av: f.avatar,
    lvl: String(f.level),
    xp: String(f.xp),
    streak: String(f.streak),
    cls: f.cls,
    rank: f.rank,
    badges: String(f.badges),
  });
  return p.toString();
}
