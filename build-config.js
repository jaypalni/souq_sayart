// Production Build Configuration
// This file contains settings to optimize builds and prevent failures

const buildConfig = {
  // Disable source maps in production
  GENERATE_SOURCEMAP: false,
  
  // Environment settings
  NODE_ENV: 'production',
  
  // Performance optimizations
  enableAnalytics: true,
  enableLogging: false,
  
  // Build optimizations
  minify: true,
  removeConsole: true,
  removeDebugger: true,
  
  // Bundle splitting
  splitChunks: true,
  runtimeChunk: true,
  
  // Memory limits for build process
  maxEntrypointSize: 512000, // 500KB
  maxAssetSize: 512000, // 500KB
  
  // Webpack optimizations
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