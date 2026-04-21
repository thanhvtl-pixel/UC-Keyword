const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    // Tương đương với plugin figmaAssetResolver bên Vite
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    
    // Fallback plugin để hỗ trợ figma:asset/ resolving
    config.resolve.plugins = config.resolve.plugins || [];
    
    // Một trick nhỏ trong Webpack để ánh xạ dynamic cho figma:asset/
    config.plugins.push(
      new (require('webpack')).NormalModuleReplacementPlugin(
        /^figma:asset\/(.*)/,
        function (resource) {
          const filename = resource.request.replace('figma:asset/', '');
          resource.request = path.resolve(__dirname, 'src/assets', filename);
        }
      )
    );

    return config;
  },
};
