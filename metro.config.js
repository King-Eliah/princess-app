const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable package exports resolution to avoid picking up ESM files
// with dynamic import() that Hermes cannot compile
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
