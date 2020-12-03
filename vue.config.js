module.exports = {
  assetsDir: 'assets',
  publicPath: "./",
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      scss: {
        prependData:'@import "@/styles/variables.scss";'
      }
    },
    extract: true
  },
  pages: {
    index: {
      entry: './src/main.js',
      title: '密码学与信息安全基础实验'
    }
  },
  devServer: {
    proxy: {
      '/devApi/': {
        target: 'http://49.235.110.8:8081/',
          changeOrigin: true,
          pathRewrite: {
          '^/devApi/': ''
        }
      },
      '/prodApi/': {
        target: 'http://49.235.110.8:8081/',
          changeOrigin: true,
          pathRewrite: {
          '^/prodApi/': ''
        }
      }
    }
  },
  productionSourceMap: false
}
