const { getDateString, saveJSON } = require("./utils");

const eventsRaw = [
  ["4 Oct 03", "LG Cup", "Mark Williams", "John Higgins"],
  ["8 Nov	03", "British Open", "Stephen Hendry", "Ronnie O'Sullivan"],
  ["18 Nov 03", "UK Championship", "Matthew Stevens", "Stephen Hendry"],
  ["19 Jan 04", "Welsh Open", "Ronnie O'Sullivan", "Steve Davis"],
  ["1 Feb 04", "Masters", "Paul Hunter", "Ronnie O'Sullivan"],
  ["1 Mar	04", "European Open", "Stephen Maguire", "Jimmy White"],
  ["10 Jan 04", "Premier League", "Stephen Hendry", "John Higgins"],
  ["23 Mar 04", "Irish Masters", "Peter Ebdon", "Mark King"],
  ["3 Apr 04", "Players Championship", "Jimmy White", "Paul Hunter"],
  ["17 Apr 04", "World Snooker Championship", "Ronnie O'Sullivan", "Graeme Dott"],
];

const prize = [
  [82500, 42500],
  [52000, 26000],
  [84500, 43000],
  [52000, 26000],
  [100000, 50000],
  [48000, 24000],
  [45000, 20000],
  [48000, 24000],
  [82500, 42500],
  [250000, 125000],
];

const players = [];
eventsRaw.forEach((event, eventIndex) => {
  [event[2], event[3]].forEach((playerName, winnerRunnerUp) => {
    let player = players.find((player) => player.name === playerName);
    if (!player) {
      player = {
        id: players.length,
        name: playerName,
        wins: [],
        runnerups: [],
        total: 0,
      };
      players.push(player);
    }
    if (winnerRunnerUp === 0) {
      player.wins.push(eventIndex);
    } else {
      player.runnerups.push(eventIndex);
    }
    player.total += prize[eventIndex][winnerRunnerUp];
  });
});
const sortedPlayers = players.sort((a, b) => b.total - a.total);

const events = eventsRaw
  .map((arr, i) => {
    return {
      id: i,
      date: getDateString(new Date(arr[0])),
      name: arr[1],
      moneyWinner: prize[i][0],
      moneyRunnerup: prize[i][1],
      winnerId: players.find((player) => player.name === arr[2]).id,
      runnerupId: players.find((player) => player.name === arr[3]).id,
    };
  })
  .sort((a, b) => b.moneyWinner + b.moneyRunnerup - (a.moneyWinner + a.moneyRunnerup));

saveJSON(`../../public/data/event-finalists-by-prize-money/2003.json`, {
  events: events,
  players: sortedPlayers,
  maxEventPrizeMoney: Math.max(...events.map((e) => e.moneyWinner + e.moneyRunnerup)),
  maxPlayerPrizeMoney: Math.max(...sortedPlayers.map((e) => e.total)),
});

// { "id": 1460, "date": "2024-04-20", "name": "World Championship", "moneyWinner": 500000, "moneyRunnerup": 200000 },
// { "id": 1, "name": "Mark Williams", "wins": [1459, 1444, 1548], "runnerups": [1461], "total": 353000 },
