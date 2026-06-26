export type GameMode = "x01" | "cricket";
export type CricketVariant = "points" | "advanced";
export type CricketTarget = "20" | "19" | "18" | "17" | "16" | "15" | "Bull";
export type CricketObjectiveTarget = "Double" | "Triple";
export type CricketHitTarget = CricketTarget | CricketObjectiveTarget | "0";
export type Multiplier = 1 | 2 | 3;
export type X01OutRule = "straight" | "double" | "master";

export type Player = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  players: Player[];
};

export type TurnPointer = {
  teamIndex: number;
  playerIndex: number;
};

export type X01Options = {
  startScore: number;
  outRule: X01OutRule;
  legsToWin: number;
};

export type X01TurnHistory = {
  id: string;
  teamId: string;
  teamName: string;
  playerName: string;
  score: number;
  darts: string[];
  previousScore: number;
  nextScore: number;
  bust: boolean;
};

export type X01GameState = {
  mode: "x01";
  teams: Team[];
  options: X01Options;
  scores: Record<string, number>;
  activeTurn: TurnPointer;
  history: X01TurnHistory[];
  winnerTeamId?: string;
};

export type CricketMarks = Record<CricketTarget, number>;

export type CricketTeamState = {
  points: number;
  marks: CricketMarks;
  doubles: number;
  triples: number;
};

export type CricketAction = {
  target: CricketHitTarget;
  multiplier: Multiplier;
};

export type CricketTurnHistory = {
  id: string;
  teamId: string;
  teamName: string;
  playerName: string;
  actions: CricketAction[];
  previousTeamState: CricketTeamState;
  nextTeamState: CricketTeamState;
  pointsScored: number;
};

export type CricketGameState = {
  mode: "cricket";
  variant: CricketVariant;
  teams: Team[];
  teamStates: Record<string, CricketTeamState>;
  activeTurn: TurnPointer;
  history: CricketTurnHistory[];
  winnerTeamId?: string;
};

export type GameSetup = {
  mode: GameMode;
  cricketVariant: CricketVariant;
  x01Options: X01Options;
  teams: Team[];
};

export type StoredGame = X01GameState | CricketGameState;
