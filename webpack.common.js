const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ProvidePlugin = require("webpack").ProvidePlugin;

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  devtool: "source-map",
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        main: {
          test: /[\\/]src[\\/]/,
          name: "main",
          chunks: "all",
        },
        "vendor-react-redux": {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-redux|redux|redux-thunk|@reduxjs)[\\/]/,
          name: "vendor-react-redux",
          chunks: "all",
        },
        "vendor-stellar": {
          test: /[\\/]node_modules[\\/](@stellar|stellar)[\\/]/,
          name: "vendor-stellar",
          chunks: "all",
        },
        "vendor-wallets": {
          test: /[\\/]node_modules[\\/](@albedo|@ledgerhq|trezor)[\\/]/,
          name: "vendor-wallets",
          chunks: "all",
        },
        "vendor-other": {
          test: /[\\/]node_modules[\\/]((?!(react|react-dom|react-router|react-router-dom|react-redux|redux|redux-thunk|@reduxjs|@stellar|stellar|@albedo|@ledgerhq|trezor)).*)[\\/]/,
          name: "vendor-other",
          chunks: "all",
        },
      },
    },
  },
  output: {
    filename: "static/[name].[contenthash].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            // Disable type checker, we will use it in ForkTsCheckerWebpackPlugin
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(scss|css)$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: {
                  removeViewBox: false,
                },
              },
            },
          },
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[contenthash].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      // Needed for SDS fonts
      "assets/fonts": path.resolve(
        __dirname,
        "./node_modules/@stellar/design-system/build/assets/fonts",
      ),
      // Path aliases for absolute path imports
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      config: path.resolve(__dirname, "./src/config"),
      constants: path.resolve(__dirname, "./src/constants"),
      ducks: path.resolve(__dirname, "./src/ducks"),
      helpers: path.resolve(__dirname, "./src/helpers"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      pages: path.resolve(__dirname, "./src/pages"),
      types: path.resolve(__dirname, "./src/types"),
    },
    // Adding node.js modules
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      url: require.resolve("url"),
      buffer: require.resolve("buffer/"),
    },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  plugins: [
    // Buffer
    new ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "./public", to: "./" },
        { from: "./src/assets", to: "./assets" },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "static/[name].[contenthash].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({
      extensions: [".tsx", ".ts", ".js"],
      exclude: "node_modules",
    }),
  ],
};
