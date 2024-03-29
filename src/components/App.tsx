import React from "react";
import { EventsByPrizeMoney } from "./EventsByPrizeMoney";
import { PlayersByPrizeMoney } from "./PlayersByPrizeMoney";
import { Graph, graphs } from "../store/types";

export function App() {
  const [graph, setGraph] = React.useState<Graph>("events");
  return (
    <main className="min-h-screen p-4 bg-slate-100">
      <select value={graph} onChange={(e) => setGraph(e.target.value as Graph)}>
        {graphs.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
      {graph === "events" && <EventsByPrizeMoney year={2023} />}
      {graph === "players" && <PlayersByPrizeMoney year={2023} />}
    </main>
  );
}
