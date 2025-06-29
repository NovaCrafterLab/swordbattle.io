const winston = require('winston');
const path = require('path');

// 创建logs目录路径
const logsDir = path.join(__dirname, '../../logs');

// 根据环境确定日志级别
const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = isDevelopment ? 'debug' : 'info';
const consoleLevel = isDevelopment ? 'debug' : 'warn';

// 自定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// 控制台格式 - 彩色和简洁
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, module }) => {
    const modulePrefix = module ? `[${module}]` : '';
    return `[${timestamp}]${modulePrefix} ${level}: ${stack || message}`;
  })
);

// 创建过滤器函数
const serverFilter = winston.format((info, opts) => {
  return info.module === 'server' ? info : false;
});

const gameFilter = winston.format((info, opts) => {
  return info.module === 'game' ? info : false;
});

// 创建Winston logger实例
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // 错误日志 - 所有错误级别
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // 服务器日志 - 仅服务器相关
    new winston.transports.File({
      filename: path.join(logsDir, 'server.log'),
      format: winston.format.combine(serverFilter(), logFormat),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // 游戏日志 - 仅游戏相关
    new winston.transports.File({
      filename: path.join(logsDir, 'game.log'),
      format: winston.format.combine(gameFilter(), logFormat),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // 调试日志 - 详细调试信息
    new winston.transports.File({
      filename: path.join(logsDir, 'debug.log'),
      level: 'debug',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // 控制台输出 - 根据环境调整级别
    new winston.transports.Console({
      level: consoleLevel,
      format: consoleFormat
    })
  ]
});

// 日志工具类
class Logger {
  // 关键错误 - 控制台红色 + error.log
  static critical(message, meta = {}, module = 'server') {
    logger.error(message, { ...meta, module, level: 'CRITICAL' });
  }
  
  // 错误 - 控制台红色 + error.log + 模块.log  
  static error(message, meta = {}, module = 'server') {
    logger.error(message, { ...meta, module });
  }
  
  // 警告 - 控制台黄色 + 模块.log
  static warn(message, meta = {}, module = 'server') {
    logger.warn(message, { ...meta, module });
  }
  
  // 信息 - 仅模块.log
  static info(message, meta = {}, module = 'server') {
    logger.info(message, { ...meta, module });
  }
  
  // 调试 - 仅debug.log
  static debug(message, meta = {}, module = 'server') {
    logger.debug(message, { ...meta, module });
  }
  
  // 游戏相关日志
  static game = {
    critical: (message, meta = {}) => Logger.critical(message, meta, 'game'),
    error: (message, meta = {}) => Logger.error(message, meta, 'game'),
    warn: (message, meta = {}) => Logger.warn(message, meta, 'game'),
    info: (message, meta = {}) => Logger.info(message, meta, 'game'),
    debug: (message, meta = {}) => Logger.debug(message, meta, 'game')
  };
  
  // 服务器相关日志（网络、区块链等）
  static server = {
    critical: (message, meta = {}) => Logger.critical(message, meta, 'server'),
    error: (message, meta = {}) => Logger.error(message, meta, 'server'), 
    warn: (message, meta = {}) => Logger.warn(message, meta, 'server'),
    info: (message, meta = {}) => Logger.info(message, meta, 'server'),
    debug: (message, meta = {}) => Logger.debug(message, meta, 'server')
  };
  
  // 特殊方法：重要状态信息显示到控制台（绿色）
  static status(message, meta = {}, module = 'server') {
    // 临时降低控制台级别以显示重要状态
    const consoleTransport = logger.transports.find(t => t.name === 'console');
    const originalLevel = consoleTransport.level;
    consoleTransport.level = 'info';
    
    logger.info(`✅ ${message}`, { ...meta, module, status: true });
    
    // 恢复原始级别
    consoleTransport.level = originalLevel;
  }
  
  // 获取当前日志配置信息
  static getConfig() {
    return {
      logLevel,
      consoleLevel,
      isDevelopment,
      logsDir
    };
  }
}

// 确保logs目录存在
const fs = require('fs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 初始化时显示配置信息
if (isDevelopment) {
  console.log(`[LOGGER] Initialized with level: ${logLevel}, console: ${consoleLevel}`);
}

module.exports = Logger; 