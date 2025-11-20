const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Find the rule that uses source-map-loader
    const sourceMapLoaderRule = config.module.rules.find(
      (rule) => rule.enforce === 'pre' && rule.use && rule.use.includes('source-map-loader')
    );

    if (sourceMapLoaderRule) {
      // Ensure exclude is an array and add the problematic module
      if (Array.isArray(sourceMapLoaderRule.exclude)) {
        sourceMapLoaderRule.exclude.push(/node_modules\/stylis-plugin-rtl/);
      } else if (sourceMapLoaderRule.exclude) {
        sourceMapLoaderRule.exclude = [sourceMapLoaderRule.exclude, /node_modules\/stylis-plugin-rtl/];
      } else {
        sourceMapLoaderRule.exclude = /node_modules\/stylis-plugin-rtl/;
      }
    }

    return config;
  }
);
