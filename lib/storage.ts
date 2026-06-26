import type { GameSetup, StoredGame } from "./types";

const SETUP_KEY = "flechettes.setup";
const X01_KEY = "flechettes.x01";
const CRICKET_KEY = "flechettes.cricket";

export function saveSetup(setup: GameSetup) {
  save(SETUP_KEY, setup);
}

export function loadSetup() {
  return load<GameSetup>(SETUP_KEY);
}

export function saveGame(game: StoredGame) {
  save(game.mode === "x01" ? X01_KEY : CRICKET_KEY, game);
}

export function loadGame<T extends StoredGame>(mode: T["mode"]) {
  return load<T>(mode === "x01" ? X01_KEY : CRICKET_KEY);
}

export function clearGame(mode: StoredGame["mode"]) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(mode === "x01" ? X01_KEY : CRICKET_KEY);
  }
}

function save<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function load<T>(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
