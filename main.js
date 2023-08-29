const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");

const isMac = process.platform === "darwin";

const isDev = process.env.NODE_ENV !== "production";

//Create main window
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegrationL: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //open devtools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

//Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About Image Resizer",
    width: 300,
    height: 300,
  });
  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  //implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+W",
      },
    ],
  },
  ...(!isMac
    ? [
        {
          label: "help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];
// OR
// const menu = [
//   {
//     role: "fileMenu",
//   },
// ];

// responde to ipcRenderer resize
ipcMain.on("image:resize", (e, options) => {
  options.dest = path.join(os.homedir);
  console.log(options);
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
