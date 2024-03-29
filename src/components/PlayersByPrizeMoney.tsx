import React from "react";
import colors from "tailwindcss/colors";
import { useEventWinnersByPrizeMoney } from "../store/hooks";
import { PrizeMoneyEvent, colorHues } from "../store/types";

interface PlayersByPrizeMoneyProps {
  year: number;
}

export function PlayersByPrizeMoney({ year }: PlayersByPrizeMoneyProps) {
  const data = useEventWinnersByPrizeMoney(year);

  const getEvent = React.useCallback(
    (eventId: number) => {
      if (!data) return null;
      const index = data.events.findIndex((e) => e.id === eventId);
      const event = data.events[index];
      return [index, event] as [number, PrizeMoneyEvent];
    },
    [data]
  );

  if (!data?.events.length) {
    return "loading...";
  }

  return (
    <>
      <h2 className="font-bold text-lg p-1 border-b border-slate-300 mb-4 text-center">
        Event winners by prize money: {year}
      </h2>
      <div className="flex items-center text-sm border-b border-slate-300 text-slate-500">
        <div className="p-1 py-2 text-right mr-4 w-1/6">Player</div>
        <div className="p-1 py-2  w-4/6">Prize money</div>
      </div>
      {data.players.map((player) => {
        return (
          <div key={player.id} className="flex items-center border-b border-slate-300 py-1">
            <div className="p-1 text-right w-1/6 mr-4">{player.name}</div>
            <div className="w-5/6 flex">
              {player.wins.map((eventId) => {
                const e = getEvent(eventId);
                if (!e) return null;
                const [eventIndex, event] = e;
                const colIndex = eventIndex % colorHues.length;
                const eventColor = colors[colorHues[colIndex]]["200"];
                return (
                  <div
                    key={eventId}
                    className="leading-none p-1 border-r-4 border-slate-100"
                    style={{ backgroundColor: eventColor, width: `${(event.money / data.maxPlayerPrizeMoney) * 100}%` }}
                  >
                    {event.name}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
