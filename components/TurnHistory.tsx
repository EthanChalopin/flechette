"use client";

import type { CricketTurnHistory, X01TurnHistory } from "@/lib/types";

type Props = {
  items: Array<X01TurnHistory | CricketTurnHistory>;
};

export function TurnHistory({ items }: Props) {
  return (
    <section className="min-h-0 rounded-lg border border-line bg-panel/90 p-3">
      <h2 className="text-base font-bold">Historique</h2>
      <div className="mt-2 grid gap-2">
        {items.length === 0 ? <p className="text-slate-400">Aucun tour joue.</p> : null}
        {items.slice(0, 2).map((item) => (
          <article className="rounded-md border border-line bg-felt/70 p-2 text-sm" key={item.id}>
            <p className="truncate font-semibold">
              {item.teamName} - {item.playerName}
            </p>
            {"score" in item ? (
              <p className="mt-0.5 truncate text-slate-300">
                {item.darts.length ? `${item.darts.join(", ")} = ` : ""}
                {item.score} pts, {item.previousScore} vers {item.nextScore}
                {item.bust ? " (bust)" : ""}
              </p>
            ) : (
              <p className="mt-0.5 truncate text-slate-300">
                {item.actions.map((action) => `${action.target} x${action.multiplier}`).join(", ")}
                {item.pointsScored ? `, +${item.pointsScored} pts` : ""}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
