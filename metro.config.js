const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Windows opens far fewer concurrent file handles than Unix by default —
// too many Metro workers transforming files in parallel hits that limit
// and throws EMFILE. Capping workers avoids it.
config.maxWorkers = 2;

module.exports = withNativewind(config, { inlineRem: 16 });
