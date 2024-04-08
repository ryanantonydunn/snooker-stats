import React from "react";
import colors from "tailwindcss/colors";
import { useEventFinalistsByPrizeMoney, useEventWinnersByPrizeMoney } from "../store/hooks";
import { PrizeMoneyEvent, colorHues } from "../store/types";

interface EventFinalistsByPrizeMoneyProps {
  year: number;
}

const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
});

function formatCurrency(n: number) {
  return formatter.format(n);
}

export function EventFinalistsByPrizeMoney({ year }: EventFinalistsByPrizeMoneyProps) {
  const data = useEventFinalistsByPrizeMoney(year);

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
    <div className="pr-4">
      <h2 className="font-bold text-lg p-1 border-b border-slate-300 mb-4 text-center">
        Event finalists by prize money: {year}/{Number(String(year).slice(-2)) + 1}
        <span className="ml-2 text-xs font-normal bg-red-300 py-1 px-2 rounded">Winner</span>
        <span className="ml-2 text-xs font-normal bg-amber-300 py-1 px-2 rounded">Runner Up</span>
      </h2>
      <div className="flex items-center text-sm border-b border-slate-300 text-slate-500">
        <div className="p-1 py-2 text-right mr-4 w-1/6">Player</div>
        <div className="p-1 py-2  w-4/6">Prize money</div>
      </div>
      {data.players.map((player) => {
        return (
          <div key={player.id} className="flex items-center border-b border-slate-300 py-1">
            <div className="p-1 text-right w-1/6 mr-4">
              {player.name}
              <br />
              <b>{formatCurrency(player.total)}</b>
            </div>
            <div className="w-5/6 flex">
              {player.wins.map((eventId) => {
                const e = getEvent(eventId);
                if (!e) return null;
                const [eventIndex, event] = e;
                const colIndex = eventIndex % colorHues.length;
                return (
                  <div
                    key={eventId}
                    className="leading-none p-2 border-r-4 border-slate-100 bg-red-300"
                    style={{
                      width: `${(event.moneyWinner / data.maxPlayerPrizeMoney) * 100}%`,
                    }}
                  >
                    {event.name}
                  </div>
                );
              })}
              {player.runnerups.map((eventId) => {
                const e = getEvent(eventId);
                if (!e) return null;
                const [eventIndex, event] = e;
                return (
                  <div
                    key={eventId}
                    className="leading-none p-2 border-r-4 border-slate-100 bg-amber-300"
                    style={{
                      width: `${(event.moneyRunnerup / data.maxPlayerPrizeMoney) * 100}%`,
                    }}
                  >
                    {event.name}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
