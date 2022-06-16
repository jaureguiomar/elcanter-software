const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      externals: ["escpos", "escpos-usb"],
      preload: "src/preload.js",
      builderOptions: {
        extraResources: [
          {
            from: "./src/assets/img",
            to: "./img"
          }
        ],
        publish: [
          {
            provider: "github",
            owner: "jaureguiomar",
            private: true,
            repo: "elcanter-software",
            releaseType: "draft"
          }
        ],
        // productName: "Elcanterero restaurante",
        // appId: "com.elcanterero.restaurante.app",
        win: {
          "target": [
              "nsis"
          ],
          icon: "src/assets/img/elcanter-icon.ico",
        },
        nsis: {
          "installerIcon": "src/assets/img/elcanter-icon.ico",
          "uninstallerIcon": "src/assets/img/elcanter-icon.ico"
        }
      }
    }
  }
});
