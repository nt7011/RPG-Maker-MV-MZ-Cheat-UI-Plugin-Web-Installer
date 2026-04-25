# RPG-Maker-MV-MZ-Cheat-UI-Plugin Web Installer

Easily install [RPG-Maker-MV-MZ-Cheat-UI-Plugin](https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin) right from the browser.

This project packages the original RPG Maker MV/MZ Cheat UI as a browser-based installer. It scans a selected game folder, copies the bundled cheat payload into the game, and injects `CheatBridge` into `plugins.js`.

## Original Project

- Original repository: https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin
- This fork keeps the cheat UI payload local so the installed plugin does not load code, stylesheets, fonts, or instructions from the internet.
- Korean README: [README_ko-kr.md](README_ko-kr.md)

## Install

Use a Chromium browser such as Chrome or Edge. Directory access requires HTTPS or `localhost`.

1. Open the deployed installer page.
2. Choose the game folder that contains `Game.exe`.
3. Confirm the detected `js/plugins` or `www/js/plugins` layout.
4. Click `Install`.
5. Launch the game and press `Ctrl + C` to open the cheat window.

The installer writes `CheatBridge.js` into the game's plugin directory, copies the `cheat-engine` runtime beside it, and adds the plugin entry to `plugins.js`. It creates backups before changing `plugins.js` and any empty `package.json` name field it has to patch.

For local development:

```sh
python3 dev-server.py
```

Then open `http://127.0.0.1:4173/`.

## UI Sample

<p float="left">
  <img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754683-4e7a09a5-2d31-436d-8546-7a5d658eb282.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754687-732648c8-3483-42bb-9634-dd22d674dfed.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754692-38e04218-7726-4827-a45b-95485de51a3c.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754696-0cbc76f9-99fa-47a7-a0d0-6510a2f76e01.JPG" width="500"/>
</p>

## Features

- GUI based RPG Maker MV/MZ cheat tool.
- Supports both RPG Maker MV and MZ games.
- Edit stats, gold, speed, items, variables, switches, and more.
- Accelerate game speed from x0.1 to x10.
- Supports no clip mode and god mode.
- Disable random encounters.
- Force battle victory, defeat, escape, or abort.
- Customizable shortcuts.
- Search items, switches, variables, and related game data.
- Save and recall locations, plus teleport cheats.
- Developer tools support.

## How To Use

- Press `Ctrl + C` to toggle the cheat window.
- You can change shortcuts in the `Shortcuts` tab.
- The cheat window appears in the upper-right corner of the game window.
- If the window is hard to see, move the mouse over it; it is partially transparent when idle.

<img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="400"/>

## Reusing Cheat Settings

To reuse shortcut keys, move speed, game speed, and other cheat settings from another game, copy the `www/cheat-settings` folder from the already configured game into the target game.

## Troubleshooting

### Game Does Not Launch

Some older RPG Maker MV games ship with outdated NW.js runtimes. The installer includes an NW.js reminder and download link for users who need to update the runtime manually.

If updating NW.js breaks the game itself, the cheat plugin cannot make that game compatible.

### Errors After Updating

Settings files created by older cheat builds may cause errors. Delete the game's `www/cheat-settings` folder and relaunch the game.
