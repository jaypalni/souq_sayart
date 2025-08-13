const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
    clean: true,
  },
  
  // Optimized for t3.medium (2 vCPUs, 4GB RAM)
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.warn'],
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: 2, // Use both vCPUs of t3.medium
        extractComments: false,
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                        removeTitle: true,
                        removeDesc: true,
                        removeMetadata: true,
                        removeComments: true,
                        removeDoctype: true,
                        removeXMLProcInst: true,
                        removeEditorsNSData: true,
                        removeEmptyAttrs: true,
                        removeHiddenElems: true,
                        removeEmptyText: true,
                        removeEmptyContainers: true,
                        removeUnusedNS: true,
                        removeUselessDefs: true,
                        removeScriptElement: true,
                        removeStyleElement: true,
                        removeDimensions: false, // Keep dimensions for proper rendering
                        removeXMLNS: false, // Keep XML namespace for SVG compatibility
                      },
                    },
                  },
                ],
              }],
            ],
          },
        },
      }),
    ],
    
    // Optimized chunk splitting for t3.medium
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 4, // Limit for t3.medium memory
      maxAsyncRequests: 4,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          enforce: true,
        },
        svg: {
          test: /\.svg$/,
          name: 'svg-assets',
          chunks: 'all',
          priority: 20,
          enforce: true,
          maxSize: 1024000, // 1MB limit for SVG chunks
        },
      },
    },
    runtimeChunk: 'single',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:8][ext]',
        },
        use: [
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeViewBox: false },
                { removeTitle: true },
                { removeDesc: true },
                { removeUselessDefs: true },
                { removeEmptyAttrs: true },
                { removeHiddenElems: true },
                { removeEmptyText: true },
                { removeEmptyContainers: true },
                { removeUnusedNS: true },
                { removeEditorsNSData: true },
                { removeXMLProcInst: true },
                { removeComments: true },
                { removeMetadata: true },
                { removeDoctype: true },
                { removeXMLNS: false }, // Keep XML namespace
                { removeScriptElement: true },
                { removeStyleElement: true },
                { removeDimensions: false }, // Keep dimensions
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:8][ext]',
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // Performance hints optimized for t3.medium
  performance: {
    hints: 'warning',
    maxEntrypointSize: 2048000, // 2MB - increased for t3.medium with large SVGs
    maxAssetSize: 2048000, // 2MB - increased for t3.medium with large SVGs
  },

  // Stats configuration for better monitoring
  stats: {
    errorDetails: true,
    children: false,
    chunks: false,
    modules: false,
  },

  // Cache configuration for faster rebuilds
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  // Handle large SVG files gracefully
  experiments: {
    topLevelAwait: true,
  },
}; 