"use client";

import type { CricketTurnHistory, X01TurnHistory } from "@/lib/types";

type Props = {
  items: Array<X01TurnHistory | CricketTurnHistory>;
};

export function TurnHistory({ items }: Props) {
  return (
    <section className="rounded-lg border border-line bg-panel/90 p-5">
      <h2 className="text-xl font-bold">Historique</h2>
      <div className="mt-4 grid max-h-[420px] gap-3 overflow-auto pr-2">
        {items.length === 0 ? <p className="text-slate-400">Aucun tour joue.</p> : null}
        {items.map((item) => (
          <article className="rounded-lg border border-line bg-felt/70 p-3" key={item.id}>
            <p className="font-semibold">
              {item.teamName} - {item.playerName}
            </p>
            {"score" in item ? (
              <p className="mt-1 text-slate-300">
                {item.darts.length ? `${item.darts.join(", ")} = ` : ""}
                {item.score} pts, {item.previousScore} vers {item.nextScore}
                {item.bust ? " (bust)" : ""}
              </p>
            ) : (
              <p className="mt-1 text-slate-300">
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
