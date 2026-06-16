const https = require('https');

// Disable TLS verification to bypass certificate errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const data = await fetchJson('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json');
  if (data) {
    console.log("SUCCESS! Keys in JSON:", Object.keys(data));
    console.log("Sample state:", data.states ? data.states[0] : "none");
  } else {
    console.log("Failed to fetch mapping.");
  }
}

run();
