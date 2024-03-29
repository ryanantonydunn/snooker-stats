const { loadJSON, saveJSON } = require("./utils");

function getEventWinnersByPrizeMoney(year) {
  const events = loadJSON(`../saved/events-in-season/${year}.json`);
  const rounds = loadJSON(`../saved/rounds-in-season/${year}.json`);

  // find events with finals
  const eventData = [];
  events.forEach((event) => {
    const eventRounds = rounds.filter((round) => round.EventID === event.ID).sort((a, b) => a.Round - b.Round);
    const final = eventRounds[eventRounds.length - 1];
    const isWorldChampionship = final.EventID === 1460; // currently has no prize money, so forcing
    if (final.ActualMoney > 20000 || isWorldChampionship) {
      eventData.push({
        id: event.ID,
        date: event.StartDate,
        name: event.Name,
        money: isWorldChampionship ? 500000 : final.ActualMoney,
      });
    }
  });

  // get match data
  eventData.forEach((event) => {
    const matches = loadJSON(`../saved/event-matches/${event.id}.json`);
    if (matches) {
      const winnerId = matches.find((m) => m.Round === 15)?.WinnerID;
      if (winnerId) {
        event.winnerId = winnerId;
      }
    }
  });

  const sortedEventData = eventData.sort((a, b) => b.money - a.money);

  // get player data
  const playerData = [];
  sortedEventData.forEach((event) => {
    if (event.winnerId) {
      const recordedPlayer = playerData.find((p) => p.id === event.winnerId);
      if (recordedPlayer) {
        recordedPlayer.wins.push(event.id);
        recordedPlayer.total += event.money;
      } else {
        const playerJson = loadJSON(`../saved/players/${event.winnerId}.json`)?.[0];
        const name = playerJson.SurnameFirst
          ? `${playerJson.LastName} ${playerJson.FirstName}`
          : `${playerJson.FirstName} ${playerJson.LastName}`;

        playerData.push({
          id: event.winnerId,
          name,
          wins: [event.id],
          total: event.money,
        });
      }
    }
  });

  const sortedPlayers = playerData.sort((a, b) => b.total - a.total);

  saveJSON(`../../public/data/event-winners-by-prize-money/${year}.json`, {
    events: sortedEventData,
    players: sortedPlayers,
    maxEventPrizeMoney: Math.max(...eventData.map((e) => e.money)),
    maxPlayerPrizeMoney: Math.max(...sortedPlayers.map((e) => e.total)),
  });
}

getEventWinnersByPrizeMoney(2023);
