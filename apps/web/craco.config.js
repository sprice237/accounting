const rawLoader = require('craco-raw-loader');

module.exports = {
  webpack: {
    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    }
  },
  plugins: [
    { 
      plugin: rawLoader,
      options: { test: /\.graphql$/ }
    }
  ]
}