import type { Team, X01GameState, X01Options } from "./types";
import { createId, getActivePlayer, getActiveTeam, getNextTurn } from "./turnLogic";

export function createX01Game(teams: Team[], options: X01Options): X01GameState {
  return {
    mode: "x01",
    teams,
    options,
    scores: Object.fromEntries(teams.map((team) => [team.id, options.startScore])),
    activeTurn: { teamIndex: 0, playerIndex: 0 },
    history: []
  };
}

export function validateX01Score(score: number, remaining: number) {
  if (!Number.isInteger(score) || score < 0 || score > 180) {
    return { valid: false, reason: "Le score doit etre un entier entre 0 et 180." };
  }

  if (score > remaining) {
    return { valid: false, reason: "Bust: le score ne peut pas descendre sous 0." };
  }

  return { valid: true };
}

export function applyX01Turn(state: X01GameState, score: number, darts: string[] = []): X01GameState {
  if (state.winnerTeamId) {
    return state;
  }

  const activeTeam = getActiveTeam(state.teams, state.activeTurn);
  const activePlayer = getActivePlayer(state.teams, state.activeTurn);
  const previousScore = state.scores[activeTeam.id] ?? state.options.startScore;
  const validation = validateX01Score(score, previousScore);
  const bust = !validation.valid;
  const nextScore = bust ? previousScore : previousScore - score;
  const winnerTeamId = nextScore === 0 ? activeTeam.id : undefined;

  return {
    ...state,
    scores: { ...state.scores, [activeTeam.id]: nextScore },
    activeTurn: winnerTeamId ? state.activeTurn : getNextTurn(state.teams, state.activeTurn),
    winnerTeamId,
    history: [
      {
        id: createId("x01-turn"),
        teamId: activeTeam.id,
        teamName: activeTeam.name,
        playerName: activePlayer?.name ?? "Joueur",
        score,
        darts,
        previousScore,
        nextScore,
        bust
      },
      ...state.history
    ]
  };
}

export function undoX01Turn(state: X01GameState): X01GameState {
  const [lastTurn, ...history] = state.history;
  if (!lastTurn) {
    return state;
  }

  const teamIndex = Math.max(
    0,
    state.teams.findIndex((team) => team.id === lastTurn.teamId)
  );
  const playerIndex = Math.max(
    0,
    state.teams[teamIndex]?.players.findIndex((player) => player.name === lastTurn.playerName) ?? 0
  );

  return {
    ...state,
    scores: { ...state.scores, [lastTurn.teamId]: lastTurn.previousScore },
    activeTurn: { teamIndex, playerIndex },
    winnerTeamId: undefined,
    history
  };
}
