// server/src/index.js
const path = require('path');
const uws = require('uWebSockets.js');
const fs = require('fs');
const util = require('util');

const Game = require('./game/Game');
const Loop = require('./utilities/Loop');
const Server = require('./network/Server');
const config = require('./config');
const { initModeration } = require('./moderation');

const readFileAsync = util.promisify(fs.readFile);

// ---------- uWS App ----------
let listenToken = null;
const app = config.useSSL
  ? uws.SSLApp({
    key_file_name: path.resolve(config.sslData.key),
    cert_file_name: path.resolve(config.sslData.cert),
  })
  : uws.App();

app.listen('0.0.0.0', config.port, (tok) => {
  if (!tok) { console.error('Port busy'); process.exit(1); }
  listenToken = tok;
  start();
  console.log(`Game started on port ${config.port}.`);
});

// ---------- CORS ----------
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'content-type',
};
const setCors = (res) => {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.writeHeader(k, v);
};

app.options('/ping', setCors);
app.get('/ping', (res) => {
  setCors(res);
  res.writeHeader('Content-Type', 'text/plain').end('pong');
});

// ---------- Bootstrap ----------
function start() {
  const game = new Game();
  game.initialize();
  const server = new Server(game);
  server.initialize(app);

  app.get('/serverinfo', (res) => {
    setCors(res);
    res.writeHeader('Content-Type', 'application/json').end(
      JSON.stringify({
        tps: game.tps,
        entityCnt: game.entities.size,
        playerCnt: game.players.size,
        realPlayers: [...game.players.values()].filter((p) => !p.isBot).length,
      }),
    );
  });
  initModeration(game, app);


  const frameTime = 1000 / config.tickRate;
  const dt = frameTime / 1000;
  const loop = new Loop(frameTime, game);

  loop.setEventHandler(() => {
    server.tick(dt);
  });
  loop.onTpsUpdate = (tps) => {
    game.tps = tps;
    loop.entityCnt = game.entities.size;
  };
  loop.start();

  // ---------- Graceful shutdown ----------
  function stop(reason) {
    try {
      console.log('Stopping game...', reason);
      if (listenToken) uws.us_listen_socket_close(listenToken);

      for (const client of server.clients.values()) {
        if (!client.player) continue;
        const data = {
          coins: client.player.levels?.coins,
          kills: client.player.kills,
          playtime: client.player.playtime,
        };
        client.saveGame(data);
      }
      console.log('All games saved. Bye.');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
  process.on('uncaughtException', (e) => { console.error(e); stop('uncaughtException'); });
  process.on('unhandledRejection', (r, p) => { console.error(r, p); stop('unhandledRejection'); });
}
