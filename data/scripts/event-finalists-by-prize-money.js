const { loadJSON, saveJSON } = require("./utils");

function getEventFinalistsByPrizeMoney(year) {
  const events = loadJSON(`../saved/events-in-season/${year}.json`);
  const rounds = loadJSON(`../saved/rounds-in-season/${year}.json`);

  // find events with finals
  const eventData = [];
  events.forEach((event) => {
    const eventRounds = rounds.filter((round) => round.EventID === event.ID).sort((a, b) => a.Round - b.Round);
    const final = eventRounds[eventRounds.length - 1];
    const semi = eventRounds[eventRounds.length - 2];
    const isWorldChampionship = final.EventID === 1460; // currently has no prize money, so forcing
    if (final.ActualMoney > 20000 || isWorldChampionship) {
      eventData.push({
        id: event.ID,
        date: event.StartDate,
        name: event.Name,
        moneyWinner: isWorldChampionship ? 500000 : final.ActualMoney,
        moneyRunnerup: isWorldChampionship ? 200000 : semi.ActualMoney,
      });
    }
  });

  // get match data
  eventData.forEach((event) => {
    const matches = loadJSON(`../saved/event-matches/${event.id}.json`);
    if (matches) {
      const final = matches.find((m) => m.Round === 15);
      if (final.WinnerID) {
        event.winnerId = final.WinnerID;
        event.runnerupId = final.WinnerID === final.Player1ID ? final.Player2ID : final.Player1ID;
      }
    }
  });

  const sortedEventData = eventData.sort((a, b) => b.moneyWinner + b.moneyRunnerup - (a.moneyWinner + a.moneyRunnerup));

  // get player data
  const playerData = [];

  function loadPlayer(id) {
    const recordedPlayer = playerData.find((p) => p.id === id);
    if (recordedPlayer) {
      return recordedPlayer;
    } else {
      const playerJson = loadJSON(`../saved/players/${id}.json`)?.[0];
      const name = playerJson.SurnameFirst
        ? `${playerJson.LastName} ${playerJson.FirstName}`
        : `${playerJson.FirstName} ${playerJson.LastName}`;

      const newPlayer = {
        id,
        name,
        wins: [],
        runnerups: [],
        total: 0,
      };
      playerData.push(newPlayer);
      return newPlayer;
    }
  }

  sortedEventData.forEach((event) => {
    if (event.winnerId) {
      const player = loadPlayer(event.winnerId);
      player.wins.push(event.id);
      player.total += event.moneyWinner;
    }
    if (event.runnerupId) {
      const player = loadPlayer(event.runnerupId);
      player.runnerups.push(event.id);
      player.total += event.moneyRunnerup;
    }
  });

  const sortedPlayers = playerData.sort((a, b) => b.total - a.total);

  saveJSON(`../../public/data/event-finalists-by-prize-money/${year}.json`, {
    events: sortedEventData,
    players: sortedPlayers,
    maxEventPrizeMoney: Math.max(...eventData.map((e) => e.moneyWinner + e.moneyRunnerup)),
    maxPlayerPrizeMoney: Math.max(...sortedPlayers.map((e) => e.total)),
  });
}

getEventFinalistsByPrizeMoney(2023);
