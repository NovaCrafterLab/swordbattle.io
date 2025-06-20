require('dotenv').config({
  path: process.env.NODE_ENV === 'production' 
    ? '../env/api.env.production'
    : '../env/api.env.development'
});

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
}

// 调试信息：显示环境变量状态
console.log('=== API Configuration Debug ===');
console.log('Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  API_PORT:', process.env.API_PORT);
console.log('  PORT:', process.env.PORT);
console.log('  DB_URL:', process.env.DB_URL);
console.log('  DB_USERNAME:', process.env.DB_USERNAME);
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  USE_SSL:', process.env.USE_SSL);
console.log('  APP_SECRET:', process.env.APP_SECRET ? '***' : 'undefined');
console.log('  SERVER_SECRET:', process.env.SERVER_SECRET ? '***' : 'undefined');

export const config: ConfigProps = {
  isProduction: process.env.NODE_ENV === 'production',
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

  usernameWaitTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  usernameLength: [1, 20],

  clanWaitTime: 7 * 24 * 60 * 60 * 1000, // 3 days
  clanLength: [0, 5],
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
