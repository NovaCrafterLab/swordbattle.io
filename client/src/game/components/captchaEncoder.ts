// client/src/game/components/captchaEncoder.ts
// Compact captcha exporter with minimal logging

import logger from '@/utils/logger';

export default function exportCaptcha(captcha: string) {
  const PARTS = 6; // number of chunks
  const MAX_LEN = 200; // max chars per chunk

  // length guard
  if (captcha.length > PARTS * MAX_LEN) {
    logger.error(
      `Captcha too long. length: ${captcha.length}, max: ${PARTS * MAX_LEN}`,
    );
    return;
  }

  const prefix = 'captchaP';
  const output: Record<string, string> = {};

  for (let i = 0; i < PARTS; i++) {
    const part = captcha.slice(i * MAX_LEN, (i + 1) * MAX_LEN);
    output[`${prefix}${i}`] = part;
  }

  // debug only—won’t show in production
  logger.debug('Captcha exported', output);

  return output;
}
