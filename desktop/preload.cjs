'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('localPreferences', Object.freeze({
  setTheme: theme => ipcRenderer.invoke('preferences:set-theme', theme)
}));
