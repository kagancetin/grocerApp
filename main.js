const { app, BrowserWindow } = require("electron");
const server = require("./app");
const nativeImage = require("electron").nativeImage;

var image = nativeImage.createFromPath(__dirname + "/icon.png");
image.setTemplateImage(true);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1281,
    height: 800,
    icon: image,
    title: "MARKET",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
