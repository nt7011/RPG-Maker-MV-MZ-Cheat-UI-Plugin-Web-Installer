export const DEFAULT_LOCALE = "en";

const STRINGS = Object.freeze({
  en: Object.freeze({
    "document.title": "RPG Maker MV/MZ Cheat UI Installer",
    "page.eyebrow": "Browser installer",
    "page.heading": "RPG Maker MV/MZ Cheat UI",
    "page.origin": "Originally from <a href=\"https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin\" target=\"_blank\" rel=\"noopener noreferrer\">paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin</a>.",
    "page.intro": "Choose the game folder and install the cheat plugin directly from the browser.",
    "page.version": "Installable version: {version}",
    "page.version.installed": "Installed version: {version}",
    "page.version.updateAvailable": "Update available: {installedVersion} -> {installableVersion}",
    "translator.heading": "Translate Games",
    "translator.copy": "Easily translate games the same way.",
    "translator.link": "Open Translator",
    "button.pickFolder": "Choose Game Folder",
    "button.install": "Install",
    "button.installing": "Installing...",
    "button.reinstall": "Reinstall",
    "button.reinstalling": "Reinstalling...",
    "tooltip.pickFolderButton": "Open the game folder that contains Game.exe.",
    "tooltip.installButton": "Install CheatBridge.js and the cheat-engine runtime into the selected game folder.",
    "tooltip.reinstallButton": "Reinstall CheatBridge.js and the cheat-engine runtime into the selected game folder.",
    "tooltip.nwjsZipLink": "Download the official NW.js runtime ZIP.",
    "section.detectedFolder": "Detected Folder",
    "folder.fieldName": "Folder",
    "folder.fieldStatus": "Status",
    "folder.fieldLayout": "Layout",
    "folder.fieldPluginTarget": "Plugin target",
    "folder.fieldPluginsFile": "plugins.js",
    "folder.nothingSelected": "Nothing selected",
    "folder.waitingForSelection": "Waiting for a folder selection.",
    "folder.unknown": "Unknown",
    "folder.missing": "Missing",
    "package.heading": "Package files",
    "package.noneInspected": "Nothing inspected yet.",
    "package.statusFound": "found",
    "package.statusMissing": "missing",
    "download.heading": "Update NW.js Runtime",
    "download.copy": "Game not launching? Some games ship with an outdated NW.js runtime. Download the updated runtime here or visit <a href=\"https://nwjs.io/\" target=\"_blank\" rel=\"noopener noreferrer\">https://nwjs.io/</a>.",
    "download.link": "nwjs-v0.110.1-win-x64.zip",
    "download.step1": "Save the ZIP in the folder with <code>Game.exe</code>.",
    "download.step2": "Unzip it there.",
    "download.step3": "Remove old <code>Game.exe</code> and rename <code>nwjs.exe</code> to <code>Game.exe</code>.",
    "section.activity": "Activity",
    "log.waitingForBundle": "Waiting to load the installer bundle.",
    "support.secureContext": "Directory access needs a secure context. Use HTTPS or localhost.",
    "support.fileSystemApi": "Use a Chromium browser with the File System Access API.",
    "support.loadingBundle": "Loading the installer bundle.",
    "support.selectFolder": "Select the game folder that contains Game.exe.",
    "support.readyToInspect": "Ready to inspect the selected folder.",
    "error.browserCannotInstall": "This browser cannot open directories for install.",
    "log.bundleLoaded": "Installer bundle loaded with {count} files.",
    "error.loadBundle": "Failed to load the installer bundle: {message}",
    "log.selectedFolder": "Selected folder: {name}",
    "log.detectedLayout": "Detected {layout}.",
    "error.folderSelection": "Folder selection failed: {message}",
    "error.permissionDenied": "Read and write permission was not granted for the selected folder.",
    "log.installComplete": "Install complete. Wrote {count} plugin files and updated {path}.",
    "log.noPackageNameChanges": "No package name changes were needed.",
    "error.installationFailed": "Installation failed: {message}",
    "core.loadManifestFailed": "Failed to load installer manifest: {status}",
    "core.selectFolderToInspectInstall": "Select a game folder to inspect the installed Cheat UI plugin.",
    "core.noInstalledPlugin": "No installed Cheat UI plugin found in {path}. Install the plugin first.",
    "core.installedPluginFound": "Found installed Cheat UI plugin in {path}.",
    "core.couldNotFindPlugins": "Could not find js/plugins or www/js/plugins in the selected folder. Are you sure you have the right folder?",
    "core.foundPluginsButMissingFile": "Found {pluginsDirPath}, but {pluginsFilePath} is missing.",
    "core.readyToInstall": "Ready to install.",
    "core.detectedFolderStructure": "Detected {layout} folder structure.",
    "core.foundEmptyName": "Found empty name field in {path}, setting to \"Game\".",
    "core.backupCreated": "Backup created: {path}",
    "core.updatedName": "Updated name field to \"Game\" in {path}.",
    "core.nameAlreadySet": "{path} name field is already set to \"{name}\".",
    "core.noEmptyName": "No empty name field found in {path}.",
    "core.couldNotProcessPackage": "Warning: Could not process {path}: {message}",
    "core.packageJsonNotFound": "package.json not found. This is normal for some RPG Maker versions.",
    "core.copiedLoader": "Copied {fileName} into {path}.",
    "core.createdSupportDirectory": "Created plugin support directory at {path}.",
    "core.copiedSupportFile": "Copied {fileName} into {path}.",
    "core.copiedVersionFile": "Copied {fileName} into {path}.",
    "core.pluginEntryAlreadyExists": "Plugin entry already exists in {path}.",
    "core.addingPluginEntry": "Adding plugin entry to {path}.",
    "core.pluginEntryAdded": "Plugin entry added to {path}.",
    "core.fetchAssetFailed": "Failed to load installer asset {path}: {status}",
    "core.couldNotParseVersion": "Could not parse {path}: {message}.",
    "core.injectPluginEntryFailure": "Unable to inject plugin entry into plugins.js automatically.",
  }),
  ko: Object.freeze({
    "document.title": "RPG Maker MV/MZ 치트 UI 설치기",
    "page.eyebrow": "브라우저 설치기",
    "page.heading": "RPG Maker MV/MZ 치트 UI",
    "page.origin": "원본 프로젝트: <a href=\"https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin\" target=\"_blank\" rel=\"noopener noreferrer\">paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin</a>.",
    "page.intro": "게임 폴더를 선택하고 브라우저에서 바로 치트 플러그인을 설치하세요.",
    "page.version": "설치 가능 버전: {version}",
    "page.version.installed": "설치된 버전: {version}",
    "page.version.updateAvailable": "업데이트 가능: {installedVersion} -> {installableVersion}",
    "translator.heading": "게임 번역",
    "translator.copy": "같은 방식으로 게임을 쉽게 번역하세요.",
    "translator.link": "번역기 열기",
    "button.pickFolder": "게임 폴더 선택",
    "button.install": "설치",
    "button.installing": "설치 중...",
    "button.reinstall": "재설치",
    "button.reinstalling": "재설치 중...",
    "tooltip.pickFolderButton": "Game.exe가 들어 있는 게임 폴더를 엽니다.",
    "tooltip.installButton": "선택한 게임 폴더에 CheatBridge.js와 cheat-engine 런타임을 설치합니다.",
    "tooltip.reinstallButton": "선택한 게임 폴더에 CheatBridge.js와 cheat-engine 런타임을 다시 설치합니다.",
    "tooltip.nwjsZipLink": "공식 NW.js 런타임 ZIP을 다운로드합니다.",
    "section.detectedFolder": "감지된 폴더",
    "folder.fieldName": "폴더",
    "folder.fieldStatus": "상태",
    "folder.fieldLayout": "구조",
    "folder.fieldPluginTarget": "플러그인 대상",
    "folder.fieldPluginsFile": "plugins.js",
    "folder.nothingSelected": "선택된 폴더 없음",
    "folder.waitingForSelection": "폴더가 선택되기를 기다리는 중입니다.",
    "folder.unknown": "알 수 없음",
    "folder.missing": "없음",
    "package.heading": "패키지 파일",
    "package.noneInspected": "아직 검사한 항목이 없습니다.",
    "package.statusFound": "있음",
    "package.statusMissing": "없음",
    "download.heading": "NW.js 런타임 업데이트",
    "download.copy": "게임이 실행되지 않나요? 일부 게임은 오래된 NW.js 런타임을 포함하고 있습니다. 업데이트된 런타임을 여기서 다운로드하거나 <a href=\"https://nwjs.io/\" target=\"_blank\" rel=\"noopener noreferrer\">https://nwjs.io/</a>를 방문하세요.",
    "download.link": "nwjs-v0.110.1-win-x64.zip",
    "download.step1": "<code>Game.exe</code>가 있는 폴더에 ZIP 파일을 저장하세요.",
    "download.step2": "그 위치에서 압축을 해제하세요.",
    "download.step3": "기존 <code>Game.exe</code>를 제거하고 <code>nwjs.exe</code> 이름을 <code>Game.exe</code>로 바꾸세요.",
    "section.activity": "활동 로그",
    "log.waitingForBundle": "설치기 번들을 불러오는 중입니다.",
    "support.secureContext": "디렉터리 접근에는 보안 컨텍스트가 필요합니다. HTTPS 또는 localhost를 사용하세요.",
    "support.fileSystemApi": "File System Access API를 지원하는 Chromium 브라우저를 사용하세요.",
    "support.loadingBundle": "설치기 번들을 불러오는 중입니다.",
    "support.selectFolder": "Game.exe가 들어 있는 게임 폴더를 선택하세요.",
    "support.readyToInspect": "선택한 폴더를 검사할 준비가 되었습니다.",
    "error.browserCannotInstall": "이 브라우저는 설치용 디렉터리 열기를 지원하지 않습니다.",
    "log.bundleLoaded": "설치기 번들을 {count}개 파일과 함께 불러왔습니다.",
    "error.loadBundle": "설치기 번들을 불러오지 못했습니다: {message}",
    "log.selectedFolder": "선택한 폴더: {name}",
    "log.detectedLayout": "{layout} 구조를 감지했습니다.",
    "error.folderSelection": "폴더 선택 실패: {message}",
    "error.permissionDenied": "선택한 폴더에 대한 읽기 및 쓰기 권한이 허용되지 않았습니다.",
    "log.installComplete": "설치가 완료되었습니다. 플러그인 파일 {count}개를 기록하고 {path}를 업데이트했습니다.",
    "log.noPackageNameChanges": "변경이 필요한 package name 항목이 없었습니다.",
    "error.installationFailed": "설치 실패: {message}",
    "core.loadManifestFailed": "설치기 매니페스트를 불러오지 못했습니다: {status}",
    "core.selectFolderToInspectInstall": "설치된 치트 UI 플러그인을 검사하려면 게임 폴더를 선택하세요.",
    "core.noInstalledPlugin": "{path}에서 설치된 치트 UI 플러그인을 찾지 못했습니다. 먼저 플러그인을 설치하세요.",
    "core.installedPluginFound": "{path}에서 설치된 치트 UI 플러그인을 찾았습니다.",
    "core.couldNotFindPlugins": "선택한 폴더에서 js/plugins 또는 www/js/plugins를 찾지 못했습니다. 올바른 폴더를 선택했는지 확인하세요.",
    "core.foundPluginsButMissingFile": "{pluginsDirPath}는 찾았지만 {pluginsFilePath} 파일이 없습니다.",
    "core.readyToInstall": "설치할 준비가 되었습니다.",
    "core.detectedFolderStructure": "{layout} 폴더 구조를 감지했습니다.",
    "core.foundEmptyName": "{path}에서 비어 있는 name 필드를 찾아 \"Game\"으로 설정합니다.",
    "core.backupCreated": "백업 생성: {path}",
    "core.updatedName": "{path}의 name 필드를 \"Game\"으로 업데이트했습니다.",
    "core.nameAlreadySet": "{path}의 name 필드는 이미 \"{name}\"(으)로 설정되어 있습니다.",
    "core.noEmptyName": "{path}에서 비어 있는 name 필드를 찾지 못했습니다.",
    "core.couldNotProcessPackage": "경고: {path}를 처리하지 못했습니다: {message}",
    "core.packageJsonNotFound": "package.json을 찾지 못했습니다. 일부 RPG Maker 버전에서는 정상입니다.",
    "core.copiedLoader": "{fileName}을(를) {path}에 복사했습니다.",
    "core.createdSupportDirectory": "{path}에 플러그인 지원 디렉터리를 만들었습니다.",
    "core.copiedSupportFile": "{fileName}을(를) {path}에 복사했습니다.",
    "core.copiedVersionFile": "{fileName}을(를) {path}에 복사했습니다.",
    "core.pluginEntryAlreadyExists": "{path}에 플러그인 항목이 이미 있습니다.",
    "core.addingPluginEntry": "{path}에 플러그인 항목을 추가합니다.",
    "core.pluginEntryAdded": "{path}에 플러그인 항목을 추가했습니다.",
    "core.fetchAssetFailed": "설치기 자산 {path}을(를) 불러오지 못했습니다: {status}",
    "core.couldNotParseVersion": "{path}을(를) 해석하지 못했습니다: {message}.",
    "core.injectPluginEntryFailure": "plugins.js에 플러그인 항목을 자동으로 삽입하지 못했습니다.",
  }),
});

export function resolveLocale(locale) {
  return normalizeLocale(locale).startsWith("ko") ? "ko" : DEFAULT_LOCALE;
}

export function detectPreferredLocale(navigatorLike = globalThis.navigator) {
  const candidates = [];

  if (Array.isArray(navigatorLike?.languages)) {
    candidates.push(...navigatorLike.languages);
  }

  if (navigatorLike?.language) {
    candidates.push(navigatorLike.language);
  }

  for (const candidate of candidates) {
    if (resolveLocale(candidate) === "ko") {
      return "ko";
    }
  }

  return DEFAULT_LOCALE;
}

export function createTranslator(locale = DEFAULT_LOCALE) {
  const resolvedLocale = resolveLocale(locale);
  const messages = STRINGS[resolvedLocale] ?? STRINGS[DEFAULT_LOCALE];
  const fallbackMessages = STRINGS[DEFAULT_LOCALE];

  return (key, params = {}) => {
    const template = messages[key] ?? fallbackMessages[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, token) => (
      Object.prototype.hasOwnProperty.call(params, token)
        ? String(params[token])
        : `{${token}}`
    ));
  };
}

function normalizeLocale(locale) {
  return String(locale ?? "").trim().toLowerCase();
}
