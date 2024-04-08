import React from "react";
import colors from "tailwindcss/colors";
import { useEventFinalistsByPrizeMoney } from "../store/hooks";
import { colorHues } from "../store/types";

interface EventsByFinalistPrizeMoneyProps {
  year: number;
}

export function EventsByFinalistPrizeMoney({ year }: EventsByFinalistPrizeMoneyProps) {
  const data = useEventFinalistsByPrizeMoney(year);

  if (!data?.events.length) {
    return "loading...";
  }

  return (
    <>
      <h2 className="font-bold text-lg p-1 border-b border-slate-300 mb-4 text-center">
        Events by finalist prize money: {year}/{Number(String(year).slice(-2)) + 1}
      </h2>
      <div className="flex items-center text-sm border-b border-slate-300 text-slate-500">
        <div className="p-1 py-2 text-right mr-4 w-2/12">Event name</div>
        <div className="p-1 py-2  w-8/12">Prize money</div>
        <div className="p-1 py-2  w-1/12 ml-4">Winner</div>
        <div className="p-1 py-2  w-1/12 ml-4">Runner Up</div>
      </div>
      {data.events.map((event) => {
        const winnerIndex = data.players.findIndex((p) => p.id === event.winnerId);
        const winner = data.players[winnerIndex];
        const runnerup = data.players.find((p) => p.id === event.runnerupId);
        const playerColor1 = winnerIndex !== -1 ? colors[colorHues[winnerIndex]]["300"] : colors.gray["300"];
        const playerColor2 = winnerIndex !== -1 ? colors[colorHues[winnerIndex]]["200"] : colors.gray["200"];
        return (
          <div key={event.id} className="flex items-center border-b border-slate-300 py-1">
            <div className="p-1 text-right w-2/12 mr-4">{event.name}</div>
            <div className="w-8/12 flex">
              <div
                className="p-1 text-black font-bold "
                style={{
                  backgroundColor: playerColor1,
                  width: `${(event.moneyWinner / data.maxEventPrizeMoney) * 100}%`,
                }}
              >
                {event.moneyWinner}
              </div>
              <div
                className="p-1 text-black font-bold border-l-2 border-black"
                style={{
                  backgroundColor: playerColor2,
                  width: `${(event.moneyRunnerup / data.maxEventPrizeMoney) * 100}%`,
                }}
              >
                {event.moneyRunnerup}
              </div>
            </div>
            <div className="p-1 ml-4 font-bold w-1/12">{winner?.name || ""}</div>
            <div className="p-1 ml-4 w-1/12">{runnerup?.name || ""}</div>
          </div>
        );
      })}
    </>
  );
}
