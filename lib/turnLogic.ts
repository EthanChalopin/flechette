import type { Team, TurnPointer } from "./types";

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getActiveTeam(teams: Team[], turn: TurnPointer) {
  return teams[turn.teamIndex] ?? teams[0];
}

export function getActivePlayer(teams: Team[], turn: TurnPointer) {
  const team = getActiveTeam(teams, turn);
  return team?.players[turn.playerIndex % Math.max(team.players.length, 1)] ?? team?.players[0];
}

export function getNextTurn(teams: Team[], turn: TurnPointer): TurnPointer {
  if (teams.length === 0) {
    return { teamIndex: 0, playerIndex: 0 };
  }

  const nextTeamIndex = (turn.teamIndex + 1) % teams.length;
  const completedRound = nextTeamIndex === 0;

  if (!completedRound) {
    const nextTeam = teams[nextTeamIndex];
    return {
      teamIndex: nextTeamIndex,
      playerIndex: normalizePlayerIndex(nextTeam, turn.playerIndex)
    };
  }

  let nextPlayerIndex = turn.playerIndex + 1;
  const maxPlayers = Math.max(...teams.map((team) => Math.max(team.players.length, 1)));
  if (nextPlayerIndex >= maxPlayers) {
    nextPlayerIndex = 0;
  }

  return {
    teamIndex: 0,
    playerIndex: normalizePlayerIndex(teams[0], nextPlayerIndex)
  };
}

function normalizePlayerIndex(team: Team, desiredIndex: number) {
  return desiredIndex % Math.max(team.players.length, 1);
}
