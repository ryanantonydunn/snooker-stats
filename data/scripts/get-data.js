const { get, saveJSON, getQueue, fileExists, unique, loadJSON } = require("./utils");

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
  const playerFile = (id) => `../saved/players/${id}.json`;
  const playerIdsNotLoaded = unique(playerIds).filter((id) => !fileExists(playerFile(id)));
  const urls = playerIdsNotLoaded.map((id) => `https://api.snooker.org/?p=${id}`);
  const data = await getQueue(urls);
  data.forEach((json, i) => {
    saveJSON(playerFile(playerIdsNotLoaded[i]), json);
  });
}

function getMatchesFromEventsInSeason(year) {
  const events = loadJSON(`../saved/events-in-season/${year}.json`);
  const rounds = loadJSON(`../saved/rounds-in-season/${year}.json`);
  const eventIds = [];
  events.forEach((event) => {
    const eventRounds = rounds.filter((round) => round.EventID === event.ID).sort((a, b) => a.Round - b.Round);
    console.log(event);
    if (eventRounds.slice(-1)[0].ActualMoney > 20000) {
      eventIds.push(event.EventID);
    }
  });
  console.log(eventIds);
}

getMatchesFromEventsInSeason(2003);
