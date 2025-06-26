// client/src/utils/recaptcha.ts
import { load } from 'recaptcha-v3';

export const initRecaptcha = async (key: string, debug = false) => {
  const recaptcha = await load(key);
  if (debug) alert('reCAPTCHA loaded');
  window.dispatchEvent(new CustomEvent('recaptchaLoaded', { detail: true }));
  (window as any).recaptcha = recaptcha;
};
