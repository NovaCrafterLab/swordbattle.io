// client/src/api.ts

/* == imports & constants == */
import { config } from './config';

const endpoint = config.apiEndpoint.startsWith('http')
  ? config.apiEndpoint
  : `${window.location.protocol}//${config.apiEndpoint}`;
const backupEndpoint = config.apiEndpointBackup
  ? config.apiEndpointBackup.startsWith('http')
    ? config.apiEndpointBackup
    : `${window.location.protocol}//${config.apiEndpointBackup}`
  : null;

let currentEndpoint: string | null = null;
const unavialableMessage = 'Server is temporarily unavailable, try again later';
const debugMode = window.location.search.includes('debugAlertMode');

/* == helpers == */
async function ensureEndpoint() {
  if (currentEndpoint) return;
  currentEndpoint = endpoint;
  try {
    await fetch(`${currentEndpoint}/games/ping`, { method: 'GET' });
  } catch {
    currentEndpoint = backupEndpoint;
  }
}

function getSecret() {
  try {
    return window.localStorage.getItem('secret') || '';
  } catch {
    return '';
  }
}

/* == core request == */
function _request(
  url: string,
  init: RequestInit & { body?: any } = {},
  useRecaptcha = false,
  cb: (d: any) => void = () => {},
) {
  ensureEndpoint().then(() => {
    const secret = getSecret();
    if (!secret && debugMode) console.warn('secret empty');

    const headers: any = {
      'Access-Control-Allow-Origin': endpoint,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    };
    if (secret) headers.Authorization = `Bearer ${secret}`;

    /* inject secret into JSON body */
    let body = init.body;
    if (body && typeof body !== 'string') body = JSON.stringify(body);
    if (body && secret) {
      try {
        const obj = JSON.parse(body);
        obj.secret ??= secret;
        body = JSON.stringify(obj);
      } catch {
        /* ignore */
      }
    }

    const fetchOptions: RequestInit = {
      mode: 'cors',
      credentials: 'include',
      ...init,
      headers,
      body,
    };

    /* recaptcha wrap */
    if (
      useRecaptcha &&
      config.recaptchaClientKey &&
      (window as any).recaptcha
    ) {
      const endpointName = url.split('/').pop() as string;
      (window as any).recaptcha
        .execute(endpointName, {})
        .then((token: string) => {
          if (token) {
            const obj = JSON.parse(body as string);
            obj.recaptchaToken = token;
            fetchOptions.body = JSON.stringify(obj);
          }
          fetch(url, fetchOptions)
            .then((r) => r.json())
            .then(cb)
            .catch(() => cb({ message: unavialableMessage }));
        });
      return;
    }

    fetch(url, fetchOptions)
      .then((r) => r.json())
      .then(cb)
      .catch(() => cb({ message: unavialableMessage }));
  });
}

/* == public wrappers == */
function get(url: string, cb?: (d: any) => void) {
  _request(url, { method: 'GET' }, false, cb);
}
function post(
  url: string,
  body?: any,
  cb?: (d: any) => void,
  token?: string,
  rec = false,
) {
  _request(
    url,
    {
      method: 'POST',
      body,
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    },
    rec,
    cb,
  );
}
function patch(url: string, body?: any, cb?: (d: any) => void) {
  _request(url, { method: 'PATCH', body }, false, cb);
}
function put(url: string, body?: any, cb?: (d: any) => void) {
  _request(url, { method: 'PUT', body }, false, cb);
}
function del(url: string, body?: any, cb?: (d: any) => void) {
  _request(url, { method: 'DELETE', body }, false, cb);
}
function postAsync<T = any>(url: string, body?: any): Promise<T> {
  return new Promise<T>((resolve) => post(url, body, resolve));
}

/** @deprecated use patch/put/del  */
function method(url: string, opts: RequestInit, cb?: (d: any) => void) {
  _request(url, opts, false, cb);
}

/* == exports == */
export { endpoint, get, post, patch, put, del, method, postAsync };
export default { endpoint, get, post, patch, put, del, method, postAsync };
