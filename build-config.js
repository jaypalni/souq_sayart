
const buildConfig = {

  GENERATE_SOURCEMAP: false,
  

  NODE_ENV: 'production',

  enableAnalytics: true,
  enableLogging: false,

  minify: true,
  removeConsole: true,
  removeDebugger: true,

  splitChunks: true,
  runtimeChunk: true,
  

  maxEntrypointSize: 512000, 
  maxAssetSize: 512000, 

  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.warn'],
    },
    mangle: true,
    output: {
      comments: false,
    },
  },
};

module.exports = buildConfig; 