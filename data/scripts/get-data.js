const { get, saveJSON, getQueue } = require("./utils");

async function getEventsInSeason(year) {
  const data = await get(`https://api.snooker.org/?t=5&s=${year}`);
  saveJSON(`../saved/events-in-season/${year}.json`, data);
}

async function getRoundsInSeason(year) {
  const data = await get(`https://api.snooker.org/?t=12&s=${year}`);
  saveJSON(`../saved/rounds-in-season/${year}.json`, data);
}

async function getEventMatches(eventIds) {
  const urls = eventIds.map((id) => `https://api.snooker.org/?t=6&e=${id}`);
  const data = await getQueue(urls);
  data.forEach((json, i) => {
    saveJSON(`../saved/event-matches/${eventIds[i]}.json`, json);
  });
}

async function getPlayers(playerIds) {
  const urls = playerIds.map((id) => `https://api.snooker.org/?p=${id}`);
  const data = await getQueue(urls);
  data.forEach((json, i) => {
    saveJSON(`../saved/players/${playerIds[i]}.json`, json);
  });
}

// const matches2023 = [
//   1461, 1448, 1466, 1444, 1449, 1467, 1450, 1468, 1447, 1451, 1452, 1453, 1548,
//   1454, 1445, 1455, 1456, 1446, 1761, 1560, 1459,
// ];
// const players2023 = [97, 16, 5, 1, 12, 81, 202, 546, 0];

// getEventMatches([1460]);
