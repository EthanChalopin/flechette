"use client";

import type { Team } from "@/lib/types";
import { createId } from "@/lib/turnLogic";

type Props = {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
};

export function TeamSetup({ teams, setTeams }: Props) {
  function setTeamCount(count: number) {
    const safeCount = Math.max(1, Math.min(8, count));
    const nextTeams = Array.from({ length: safeCount }, (_, index) => {
      return (
        teams[index] ?? {
          id: createId("team"),
          name: `Equipe ${index + 1}`,
          players: [{ id: createId("player"), name: `Joueur ${index + 1}.1` }]
        }
      );
    });
    setTeams(nextTeams);
  }

  function setPlayersPerTeam(count: number) {
    const safeCount = Math.max(1, Math.min(8, count));
    setTeams(
      teams.map((team, teamIndex) => ({
        ...team,
        players: Array.from({ length: safeCount }, (_, playerIndex) => {
          return team.players[playerIndex] ?? {
            id: createId("player"),
            name: `Joueur ${teamIndex + 1}.${playerIndex + 1}`
          };
        })
      }))
    );
  }

  function updateTeamName(teamId: string, name: string) {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, name } : team)));
  }

  function updatePlayerName(teamId: string, playerId: string, name: string) {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? { ...team, players: team.players.map((player) => (player.id === playerId ? { ...player, name } : player)) }
          : team
      )
    );
  }

  return (
    <section className="rounded-lg border border-line bg-panel/90 p-4 sm:p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Nombre d'equipes</span>
          <select
            className="focus-ring rounded-md border border-line bg-felt px-3 py-3 text-lg"
            value={teams.length}
            onChange={(event) => setTeamCount(Number(event.target.value))}
          >
            {COUNT_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-slate-300">Joueurs par equipe</span>
          <select
            className="focus-ring rounded-md border border-line bg-felt px-3 py-3 text-lg"
            value={teams[0]?.players.length ?? 1}
            onChange={(event) => setPlayersPerTeam(Number(event.target.value))}
          >
            {COUNT_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {teams.map((team) => (
          <div className="rounded-lg border border-line bg-felt/80 p-3 sm:p-4" key={team.id}>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Nom de l'equipe</span>
              <input
                className="focus-ring rounded-md border border-line bg-panel px-3 py-2"
                value={team.name}
                onChange={(event) => updateTeamName(team.id, event.target.value)}
              />
            </label>
            <div className="mt-3 grid gap-2 sm:gap-3">
              {team.players.map((player, index) => (
                <label className="grid gap-2" key={player.id}>
                  <span className="text-sm text-slate-400">Joueur {index + 1}</span>
                  <input
                    className="focus-ring rounded-md border border-line bg-panel px-3 py-2"
                    value={player.name}
                    onChange={(event) => updatePlayerName(team.id, player.id, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
