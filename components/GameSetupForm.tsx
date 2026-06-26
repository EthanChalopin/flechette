"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CricketVariant, GameMode, Team, X01OutRule } from "@/lib/types";
import { createId } from "@/lib/turnLogic";
import { saveSetup } from "@/lib/storage";
import { createX01Game } from "@/lib/x01Logic";
import { createCricketGame } from "@/lib/cricketLogic";
import { saveGame } from "@/lib/storage";
import { TeamSetup } from "./TeamSetup";

const initialTeams: Team[] = [
  {
    id: createId("team"),
    name: "Equipe 1",
    players: [{ id: createId("player"), name: "Joueur 1.1" }]
  },
  {
    id: createId("team"),
    name: "Equipe 2",
    players: [{ id: createId("player"), name: "Joueur 2.1" }]
  }
];

const X01_START_SCORES = [101, 201, 301, 401, 501, 601, 701, 801, 901, 1001];

export function GameSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<GameMode>("x01");
  const [cricketVariant, setCricketVariant] = useState<CricketVariant>("points");
  const [startScore, setStartScore] = useState(501);
  const [outRule, setOutRule] = useState<X01OutRule>("straight");
  const [legsToWin, setLegsToWin] = useState(1);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  useEffect(() => {
    const requestedMode = searchParams.get("mode");
    if (requestedMode === "x01" || requestedMode === "cricket") {
      setMode(requestedMode);
    }
  }, [searchParams]);

  function launchGame() {
    const cleanedTeams = teams.map((team, teamIndex) => ({
      ...team,
      name: team.name.trim() || `Equipe ${teamIndex + 1}`,
      players: team.players.length
        ? team.players.map((player, playerIndex) => ({
            ...player,
            name: player.name.trim() || `Joueur ${teamIndex + 1}.${playerIndex + 1}`
          }))
        : [{ id: createId("player"), name: `Joueur ${teamIndex + 1}.1` }]
    }));

    const setup = {
      mode,
      cricketVariant,
      x01Options: {
        startScore: X01_START_SCORES.includes(startScore) ? startScore : 501,
        outRule,
        legsToWin: Math.max(1, legsToWin)
      },
      teams: cleanedTeams
    };

    saveSetup(setup);
    if (mode === "x01") {
      saveGame(createX01Game(cleanedTeams, setup.x01Options));
      router.push("/x01");
    } else {
      saveGame(createCricketGame(cleanedTeams, cricketVariant));
      router.push("/cricket");
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-line bg-panel/90 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Mode</span>
            <div className="rounded-md border border-line bg-felt px-3 py-3 font-semibold">
              {mode === "x01" ? "X01" : "Cricket"}
            </div>
          </label>

          {mode === "x01" ? (
            <>
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Score de depart</span>
                <select
                  className="focus-ring rounded-md border border-line bg-felt px-3 py-3"
                  value={startScore}
                  onChange={(event) => setStartScore(Number(event.target.value))}
                >
                  {X01_START_SCORES.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Sortie</span>
                <select
                  className="focus-ring rounded-md border border-line bg-felt px-3 py-3"
                  value={outRule}
                  onChange={(event) => setOutRule(event.target.value as X01OutRule)}
                >
                  <option value="straight">Simple</option>
                  <option value="double">Double out</option>
                  <option value="master">Master out</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Legs a gagner</span>
                <input
                  className="focus-ring rounded-md border border-line bg-felt px-3 py-3"
                  min={1}
                  type="number"
                  value={legsToWin}
                  onChange={(event) => setLegsToWin(Number(event.target.value))}
                />
              </label>
            </>
          ) : (
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Variante Cricket</span>
              <select
                className="focus-ring rounded-md border border-line bg-felt px-3 py-3"
                value={cricketVariant}
                onChange={(event) => setCricketVariant(event.target.value as CricketVariant)}
              >
                <option value="points">Avec points</option>
                <option value="advanced">Avance sans points</option>
              </select>
            </label>
          )}
        </div>
      </section>

      <TeamSetup teams={teams} setTeams={setTeams} />

      <button
        className="focus-ring rounded-md bg-lime px-6 py-4 text-lg font-bold text-felt transition hover:bg-white"
        type="button"
        onClick={launchGame}
      >
        Lancer la partie
      </button>
    </div>
  );
}
