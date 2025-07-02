// 获取环境变量，优先使用系统/命令行设置，否则默认为development
const ENV = process.env.NODE_ENV || 'development';
const isDev = ENV === 'development';
const isProduction = ENV === 'production';

// 根据环境变量加载对应的配置文件
require('dotenv').config({
  path: isProduction
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
  defaultClanColor: string;
}

// 调试信息：显示环境变量状态
console.log('=== API Configuration Debug ===');
console.log('环境变量来源分析:');
console.log('  ENV (resolved):', ENV);
console.log('  ENV来源:', process.env.NODE_ENV ? '系统/命令行' : '默认值');
console.log('  isDev:', isDev);
console.log('  isProduction:', isProduction);
console.log('  加载的配置文件:', isProduction ? 'api.env.production' : 'api.env.development');
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
