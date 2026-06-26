import type {
  CricketAction,
  CricketGameState,
  CricketMarks,
  CricketTarget,
  CricketTeamState,
  CricketVariant,
  Team
} from "./types";
import { createId, getActivePlayer, getActiveTeam, getNextTurn } from "./turnLogic";

export const CRICKET_TARGETS: CricketTarget[] = ["20", "19", "18", "17", "16", "15", "Bull"];

export function createEmptyMarks(): CricketMarks {
  return Object.fromEntries(CRICKET_TARGETS.map((target) => [target, 0])) as CricketMarks;
}

export function createCricketTeamState(): CricketTeamState {
  return {
    points: 0,
    marks: createEmptyMarks(),
    doubles: 0,
    triples: 0
  };
}

export function createCricketGame(teams: Team[], variant: CricketVariant): CricketGameState {
  return {
    mode: "cricket",
    variant,
    teams,
    teamStates: Object.fromEntries(teams.map((team) => [team.id, createCricketTeamState()])),
    activeTurn: { teamIndex: 0, playerIndex: 0 },
    history: []
  };
}

export function applyCricketTurn(state: CricketGameState, actions: CricketAction[]): CricketGameState {
  if (state.winnerTeamId || actions.length === 0) {
    return state;
  }

  const activeTeam = getActiveTeam(state.teams, state.activeTurn);
  const activePlayer = getActivePlayer(state.teams, state.activeTurn);
  const previousTeamState = cloneTeamState(state.teamStates[activeTeam.id]);
  const { nextTeamState, pointsScored } = applyActionsToTeamState(state, activeTeam.id, actions);

  const teamStates = {
    ...state.teamStates,
    [activeTeam.id]: nextTeamState
  };
  const provisionalState = { ...state, teamStates };
  const winnerTeamId = checkCricketWinner(provisionalState, activeTeam.id) ? activeTeam.id : undefined;

  return {
    ...state,
    teamStates,
    activeTurn: winnerTeamId ? state.activeTurn : getNextTurn(state.teams, state.activeTurn),
    winnerTeamId,
    history: [
      {
        id: createId("cricket-turn"),
        teamId: activeTeam.id,
        teamName: activeTeam.name,
        playerName: activePlayer?.name ?? "Joueur",
        actions,
        previousTeamState,
        nextTeamState,
        pointsScored
      },
      ...state.history
    ]
  };
}

export function previewCricketTurn(state: CricketGameState, actions: CricketAction[]): CricketGameState {
  if (actions.length === 0 || state.winnerTeamId) {
    return state;
  }

  const activeTeam = getActiveTeam(state.teams, state.activeTurn);
  const { nextTeamState } = applyActionsToTeamState(state, activeTeam.id, actions);

  return {
    ...state,
    teamStates: {
      ...state.teamStates,
      [activeTeam.id]: nextTeamState
    }
  };
}

export function undoCricketTurn(state: CricketGameState): CricketGameState {
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
    teamStates: { ...state.teamStates, [lastTurn.teamId]: lastTurn.previousTeamState },
    activeTurn: { teamIndex, playerIndex },
    winnerTeamId: undefined,
    history
  };
}

export function checkCricketWinner(state: CricketGameState, teamId: string) {
  const teamState = state.teamStates[teamId];
  const allTargetsClosed = CRICKET_TARGETS.every((target) => teamState.marks[target] >= 3);

  if (!allTargetsClosed) {
    return false;
  }

  if (state.variant === "advanced") {
    return teamState.doubles >= 3 && teamState.triples >= 3;
  }

  return state.teams.every((team) => team.id === teamId || teamState.points >= state.teamStates[team.id].points);
}

function isTargetOpenForOpponent(state: CricketGameState, teamId: string, target: CricketTarget) {
  return state.teams.some((team) => team.id !== teamId && state.teamStates[team.id].marks[target] < 3);
}

function targetValue(target: CricketTarget) {
  return target === "Bull" ? 25 : Number(target);
}

function applyActionsToTeamState(state: CricketGameState, teamId: string, actions: CricketAction[]) {
  const nextTeamState = cloneTeamState(state.teamStates[teamId]);
  let pointsScored = 0;

  for (const action of actions) {
    if (action.target === "0") {
      continue;
    }

    if (state.variant === "advanced" && action.target === "Double") {
      nextTeamState.doubles = Math.min(3, nextTeamState.doubles + 1);
      continue;
    }

    if (state.variant === "advanced" && action.target === "Triple") {
      nextTeamState.triples = Math.min(3, nextTeamState.triples + 1);
      continue;
    }

    if (action.target === "Double" || action.target === "Triple") {
      continue;
    }

    const before = nextTeamState.marks[action.target];
    const after = before + action.multiplier;
    const scoringMarks = Math.max(0, after - 3);
    nextTeamState.marks[action.target] = Math.min(3, after);

    // En Cricket avec points, les marques au-dela de la fermeture scorent tant qu'une equipe adverse est ouverte.
    if (state.variant === "points" && before >= 3 && isTargetOpenForOpponent(state, teamId, action.target)) {
      const points = targetValue(action.target) * action.multiplier;
      nextTeamState.points += points;
      pointsScored += points;
    } else if (
      state.variant === "points" &&
      before < 3 &&
      scoringMarks > 0 &&
      isTargetOpenForOpponent(state, teamId, action.target)
    ) {
      const points = targetValue(action.target) * scoringMarks;
      nextTeamState.points += points;
      pointsScored += points;
    }
  }

  return { nextTeamState, pointsScored };
}

function cloneTeamState(teamState: CricketTeamState): CricketTeamState {
  return {
    points: teamState.points,
    doubles: teamState.doubles,
    triples: teamState.triples,
    marks: { ...teamState.marks }
  };
}
