// client/config/webpackDevServer.config.js
'use strict';

const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = (proxy, allowedHost) => {
  const disableFirewall =
    !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';

  return {
    /* security */
    allowedHosts: disableFirewall ? 'all' : [allowedHost],
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*' },

    /* static assets */
    compress: true,
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      watch: { ignored: ignoredFiles(paths.appSrc) },
    },

    /* client overlay & HMR socket */
    client: {
      webSocketURL: { hostname: sockHost, pathname: sockPath, port: sockPort },
      overlay: { errors: true, warnings: false },
    },

    /* middleware for dev build */
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1), // strip trailing slash
    },

    /* HTTPS / host / history fallback */
    https: getHttpsConfig(),
    host,
    historyApiFallback: { disableDotRule: true, index: paths.publicUrlOrPath },

    /* proxy passes through */
    proxy,

    /* unified middleware hook (WDS ≥ 4.7) */
    setupMiddlewares: (middlewares, devServer) => {
      // source-map overlay
      middlewares.unshift(evalSourceMapMiddleware(devServer));

      // user-defined proxy setup file
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }

      // redirect to PUBLIC_URL / homepage
      middlewares.push(redirectServedPath(paths.publicUrlOrPath));

      // disable stale service worker in dev
      middlewares.push(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },
  };
};
