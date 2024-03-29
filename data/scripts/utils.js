const path = require("path");
const fs = require("fs");
require("dotenv").config();

/**
 * Get request
 */
async function get(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { "X-Requested-By": process.env.REQUESTED_BY || "" },
  });
  return await response.json();
}

/**
 * Get queue
 * API is rate limited to 10 requests per minute
 */
async function getQueue(allUrls) {
  const urlsSubArray = [];
  while (allUrls.length) {
    urlsSubArray.push(allUrls.splice(0, 10));
  }
  const responses = [];
  for (let i1 = 0; i1 < urlsSubArray.length; i1++) {
    const urls = urlsSubArray[i1];
    for (let i2 = 0; i2 < urls.length; i2++) {
      console.log(`Fetching ${urls[i2]}`);
      const res = await get(urls[i2]);
      responses.push(res);
    }
    // wait one minute before doing next round of ten
    if (i1 < urlsSubArray.length - 1) {
      await delay(60000);
    }
  }
  return responses;
}

/**
 * Save JSON file
 */
function saveJSON(filePath, data) {
  const src = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(src), { recursive: true });
  fs.writeFileSync(src, JSON.stringify(data));
}

/**
 * Load JSON file
 */
function loadJSON(filePath) {
  const src = path.join(__dirname, filePath);
  const str = fs.readFileSync(src);
  return JSON.parse(str);
}

/**
 * Generate a date string for use in filenames
 */
function getDateString(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Await a delay
 */
async function delay(ms) {
  console.log(`Waiting for ${ms} miliseconds`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  get,
  getQueue,
  getDateString,
  loadJSON,
  saveJSON,
};
