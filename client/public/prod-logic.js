// client/public/prod-logic.js
/* global location, import */

/* banner in dev console */
console.log(
  '%cSwordbattle.io %cV2\n%cA project by %cGautam\n\n%cgithub.com/codergautam',
  'color:orange;font-size:30px;',
  'color:red;font-size:30px;',
  'color:green;font-size:20px;',
  'color:cyan;font-size:20px',
  'color:grey;font-size:10px',
);

const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

/* helper to inject script */
function load(src, async = true) {
  const s = document.createElement('script');
  s.src = src;
  s.async = async;
  document.head.appendChild(s);
}

/* ---- Google Analytics ---- */
if (!isLocal) {
  load('https://www.googletagmanager.com/gtag/js?id=G-35EKK5X5R4');
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  } // eslint-disable-line prefer-rest-params
  gtag('js', new Date());
  gtag('config', 'G-35EKK5X5R4');
}

/* ---- Ads (provider via webpack define) ---- */
const adProvider = '<%= htmlWebpackPlugin.options.adProvider %>' || 'adinplay';
if (!isLocal)
  switch (adProvider) {
    case 'adinplay':
      load('//api.adinplay.com/libs/aiptag/pub/SWT/swordbattle.io/tag.min.js');
      break;
    case 'gamepix':
      load('https://integration.gamepix.com/sdk/v3/gamepix.sdk.js');
      break;
    /* add more providers here */
  }

/* ---- Playlight SDK ---- */
if (!isLocal) {
  import('https://sdk.playlight.dev/playlight-sdk.es.js')
    .then(({ default: SDK }) =>
      SDK.init({
        button: { visible: false },
        exitIntent: { enabled: false },
      }),
    )
    .then((sdk) => {
      window.showPlaylight = (v) => sdk.setDiscovery(v);
    })
    .catch((e) => console.error('[Playlight]', e));
}
