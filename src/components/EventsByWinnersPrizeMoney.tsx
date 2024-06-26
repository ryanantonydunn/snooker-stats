import React from "react";
import colors from "tailwindcss/colors";
import { useEventWinnersByPrizeMoney } from "../store/hooks";
import { colorHues } from "../store/types";

interface EventsByWinnersPrizeMoneyProps {
  year: number;
}

export function EventsByWinnersPrizeMoney({ year }: EventsByWinnersPrizeMoneyProps) {
  const data = useEventWinnersByPrizeMoney(year);

  if (!data?.events.length) {
    return "loading...";
  }

  return (
    <>
      <h2 className="font-bold text-lg p-1 border-b border-slate-300 mb-4 text-center">
        Events by winner prize money: {year}/{Number(String(year).slice(-2)) + 1}
      </h2>
      <div className="flex items-center text-sm border-b border-slate-300 text-slate-500">
        <div className="p-1 py-2 text-right mr-4 w-1/6">Event name</div>
        <div className="p-1 py-2  w-4/6">Prize money</div>
        <div className="p-1 py-2  w-1/6 ml-4">Winner</div>
      </div>
      {data.events.map((event) => {
        const playerIndex = data.players.findIndex((p) => p.id === event.winnerId);
        const player = data.players[playerIndex];
        const playerColor = playerIndex !== -1 ? colors[colorHues[playerIndex]]["700"] : colors.gray["500"];
        return (
          <div key={event.id} className="flex items-center border-b border-slate-300 py-1">
            <div className="p-1 text-right w-1/6 mr-4">{event.name}</div>
            <div className="w-4/6">
              <div
                className="p-1 text-white font-bold "
                style={{
                  backgroundColor: playerColor,
                  width: `${(event.moneyWinner / data.maxEventPrizeMoney) * 100}%`,
                }}
              >
                {event.moneyWinner}
              </div>
            </div>
            <div className="p-1 ml-4 font-bold w-1/6" style={{ color: playerColor }}>
              {player?.name || ""}
            </div>
          </div>
        );
      })}
    </>
  );
}
