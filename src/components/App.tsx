import React from "react";
import { Graph, graphs } from "../store/types";
import { EventWinnersByPrizeMoney } from "./EventWinnersByPrizeMoney";
import { EventsByWinnersPrizeMoney } from "./EventsByWinnersPrizeMoney";
import { EventsByFinalistPrizeMoney } from "./EventsByFinalistPrizeMoney";
import { EventFinalistsByPrizeMoney } from "./EventFinalistsByPrizeMoney";

export function App() {
  const [graph, setGraph] = React.useState<Graph>("eventsByWinnersPrizeMoney");
  return (
    <main className="min-h-screen p-4 bg-slate-100">
      <select value={graph} onChange={(e) => setGraph(e.target.value as Graph)}>
        {graphs.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
      {graph === "eventsByWinnersPrizeMoney" && <EventsByWinnersPrizeMoney year={2023} />}
      {graph === "eventWinnersByPrizeMoney" && <EventWinnersByPrizeMoney year={2023} />}
      {graph === "eventsByFinalistPrizeMoney" && <EventsByFinalistPrizeMoney year={2003} />}
      {graph === "eventFinalistsByPrizeMoney" && <EventFinalistsByPrizeMoney year={2003} />}
    </main>
  );
}
