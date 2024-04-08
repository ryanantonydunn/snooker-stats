export const colorHues = [
  "red",
  "green",
  "violet",
  "amber",
  "blue",
  "purple",
  "pink",
  "sky",
  "rose",
  "lime",
  "cyan",
  "orange",
  "yellow",
  "fuchsia",
  "teal",
  "emerald",
  "indigo",
] as const;

export type ColorHue = (typeof colorHues)[number];

export const graphs = [
  "eventWinnersByPrizeMoney",
  "eventsByWinnersPrizeMoney",
  "eventsByFinalistPrizeMoney",
  "eventFinalistsByPrizeMoney",
] as const;

export type Graph = (typeof graphs)[number];

export interface PrizeMoneyEvent {
  id: number;
  date: string;
  name: string;
  moneyWinner: number;
  moneyRunnerup: number;
  winnerId?: number;
  runnerupId?: number;
  moneyPercentage: number;
}

export interface PrizeMoneyPlayer {
  id: number;
  name: string;
  wins: number[];
  runnerups: number[];
  total: number;
}

export interface PrizeMoney {
  events: PrizeMoneyEvent[];
  players: PrizeMoneyPlayer[];
  maxEventPrizeMoney: number;
  maxPlayerPrizeMoney: number;
}
