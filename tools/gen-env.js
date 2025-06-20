// scripts/gen-env.js
/* eslint-disable no-console */
const fs   = require('fs');
const path = require('path');

const ENV_DIR        = path.resolve(__dirname, '../env');
const EXAMPLE_SUFFIX = '.env.example';
const TARGET_ENVS    = ['development', 'production'];
const GLOBAL_HEADER  = [
  '#'.repeat(80),
  '#  GLOBAL (applies to every container / process)',
  '#'.repeat(80),
];

function globalPresets(env) {
  return [
    `NODE_ENV=${env}`,
    `DEBUG=${env === 'development' ? 'true' : 'false'}`,
    'TZ=UTC',
  ];
}

function mergeContent(raw, env) {
  const bodyLines   = raw.trimEnd().split('\n');
  const existingKey = new Set();

  bodyLines.forEach((l) => {
    const line = l.trim();
    if (!line || line.startsWith('#')) return;
    existingKey.add(line.split('=')[0]);
  });

  const presets = globalPresets(env).filter((p) => {
    const key = p.split('=')[0];
    return !existingKey.has(key);
  });

  return [...GLOBAL_HEADER, ...presets, '', ...bodyLines].join('\n') + '\n';
}

// *.env.example
fs.readdirSync(ENV_DIR)
  .filter((file) => file.endsWith(EXAMPLE_SUFFIX))
  .forEach((file) => {
    const base = file.slice(0, -EXAMPLE_SUFFIX.length); // api / client / server
    const src  = path.join(ENV_DIR, file);
    const raw  = fs.readFileSync(src, 'utf8');

    TARGET_ENVS.forEach((env) => {
      const target  = path.join(ENV_DIR, `${base}.env.${env}`);
      const content = mergeContent(raw, env);

      if (fs.existsSync(target)) {
        console.log(`↷  Skip   ${path.basename(target)} (already exists)`);
      } else {
        fs.writeFileSync(target, content);
        console.log(`✅  Create ${path.basename(target)}`);
      }
    });
  });

console.log('🎉  All env files ready!');
