import React from "react";
import { PrizeMoney } from "./types";

export const useEventWinnersByPrizeMoney = (year: number) => {
  const [data, setData] = React.useState<PrizeMoney | null>(null);
  React.useEffect(() => {
    async function loadData() {
      const res = await fetch(`/data/event-winners-by-prize-money/${year}.json`);
      const json = (await res.json()) as PrizeMoney;
      setData(json);
    }
    loadData();
  }, [year]);
  return data;
};
