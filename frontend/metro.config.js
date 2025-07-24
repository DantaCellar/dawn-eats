const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 禁用文件监控以解决 EMFILE 错误
config.watchFolders = [];
config.watcher = {
  watchman: {
    deferStates: ['hg.update'],
  },
  // 禁用本地文件系统监控
  additional: [],
};

// 使用轮询模式
config.resolver.useWatchman = false;

module.exports = config;