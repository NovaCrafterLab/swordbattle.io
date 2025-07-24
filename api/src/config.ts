// 获取环境变量，优先使用系统/命令行设置，否则默认为development
const ENV = process.env.BUILD_ENV || 'development';
const isDev = ENV === 'development';
const isProduction = ENV === 'production';

require('dotenv').config();

console.log('state:', process.env.BUILD_ENV);
console.log('workspace:', process.cwd());

interface ConfigProps {
  isProduction: boolean;
  port: number;
  databaseURL: string;
  useSSL: boolean;
  appSecret: string;
  serverSecret: string;

  usernameWaitTime: number;
  usernameLength: [number, number];

  clanWaitTime: number;
  clanLength: [number, number];
  defaultClanColor: string;

  gameServerUrl: string;
}

export const config: ConfigProps = {
  isProduction: isProduction,
  port:
    parseInt(process.env.API_PORT, 10) ||
    parseInt(process.env.PORT, 10) ||
    8080,
  databaseURL:
    process.env.DB_URL ||
    `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/postgres`,
  useSSL: (process.env.USE_SSL || '').toLowerCase() === 'true',
  appSecret: process.env.APP_SECRET || 'app-secret',
  serverSecret: process.env.SERVER_SECRET || 'server-secret',

  usernameWaitTime: 3 * 24 * 60 * 60 * 1000, // 3 days
  usernameLength: [1, 20],

  clanWaitTime: 1 * 24 * 60 * 60 * 1000, // 1 days
  clanLength: [1, 7],
  defaultClanColor: '#ffffff',

  gameServerUrl: process.env.GAME_SERVER_URL || '',
};

// 调试信息：显示最终配置
console.log('Final Configuration:');
console.log('  isProduction:', config.isProduction);
console.log('  port:', config.port);
console.log('  databaseURL:', config.databaseURL);
console.log('  useSSL:', config.useSSL);
console.log('  appSecret:', config.appSecret ? '***' : 'undefined');
console.log('  serverSecret:', config.serverSecret ? '***' : 'undefined');
console.log('===============================');
