import {
  ensureReadWritePermission,
  inspectGameDirectory,
  installGame,
  isVersionOutdated,
  loadInstalledPlugin,
  loadManifest,
  loadVersionInfo,
} from "./installer-core.mjs";
import {
  createTranslator,
  detectPreferredLocale,
} from "./i18n.mjs";

const VERSION_STATUS_TONE_CLASSES = [
  "is-neutral",
  "is-warning",
  "is-success",
];
const locale = detectPreferredLocale(window.navigator);
const t = createTranslator(locale);

const state = {
  manifest: null,
  rootHandle: null,
  inspection: null,
  busy: false,
  busyAction: null,
  logs: [],
  existingInstallationDetected: false,
  pluginVersion: null,
  installedPluginVersion: null,
  installedVersionChecked: false,
};

const pickFolderButton = document.querySelector("#pick-folder-button");
const installButton = document.querySelector("#install-button");
const pluginVersion = document.querySelector("#plugin-version");
const supportNote = document.querySelector("#support-note");
const folderName = document.querySelector("#folder-name");
const folderStatus = document.querySelector("#folder-status");
const folderLayout = document.querySelector("#folder-layout");
const pluginTarget = document.querySelector("#plugin-target");
const pluginsFile = document.querySelector("#plugins-file");
const packageList = document.querySelector("#package-list");
const logList = document.querySelector("#log-list");

applyDocumentTranslations();

pickFolderButton.addEventListener("click", handlePickFolder);
installButton.addEventListener("click", handleInstall);

render();
initialize();

function applyDocumentTranslations() {
  document.documentElement.lang = locale;

  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }

  for (const element of document.querySelectorAll("[data-i18n-html]")) {
    element.innerHTML = t(element.dataset.i18nHtml);
  }

  for (const element of document.querySelectorAll("[data-i18n-title]")) {
    element.title = t(element.dataset.i18nTitle);
  }
}

async function initialize() {
  state.pluginVersion = await loadVersionInfo(new URL("./version.json", import.meta.url));

  if (!supportsInstallation()) {
    pushLog(t("error.browserCannotInstall"), "error");
    render();
    return;
  }

  try {
    state.manifest = await loadManifest(new URL("./installer-manifest.json", import.meta.url), { t });
    pushLog(
      t("log.bundleLoaded", {
        count: state.manifest.supportFiles.length + 2,
      }),
      "info",
    );

    if (state.rootHandle) {
      await refreshInstalledPluginSnapshot({ logOutcome: false });
    }
  } catch (error) {
    pushLog(t("error.loadBundle", { message: error.message }), "error");
  }

  render();
}

async function handlePickFolder() {
  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    state.rootHandle = handle;
    pushLog(t("log.selectedFolder", { name: handle.name }), "info");

    state.inspection = await inspectGameDirectory(handle, { t });
    if (state.inspection.valid) {
      pushLog(t("log.detectedLayout", { layout: state.inspection.layoutLabel }), "success");
    } else {
      pushLog(state.inspection.reason, "warning");
    }

    await refreshInstalledPluginSnapshot({ logOutcome: true });
  } catch (error) {
    if (error?.name !== "AbortError") {
      pushLog(t("error.folderSelection", { message: error.message }), "error");
    }
  }

  render();
}

async function handleInstall() {
  if (!canInstall()) {
    return;
  }

  state.busy = true;
  state.busyAction = "install";
  render();

  try {
    const permissionGranted = await ensureReadWritePermission(state.rootHandle);
    if (!permissionGranted) {
      throw new Error(t("error.permissionDenied"));
    }

    const result = await installGame(state.rootHandle, state.manifest, {
      baseUrl: import.meta.url,
      log: pushLog,
      t,
    });

    pushLog(
      t("log.installComplete", {
        count: result.filesCopied,
        path: result.supportDirectory,
      }),
      "success",
    );
    if (result.packageUpdates === 0) {
      pushLog(t("log.noPackageNameChanges"), "info");
    }

    state.inspection = await inspectGameDirectory(state.rootHandle, { t });
    await refreshInstalledPluginSnapshot({ logOutcome: true });
  } catch (error) {
    pushLog(t("error.installationFailed", { message: error.message }), "error");
  } finally {
    state.busy = false;
    state.busyAction = null;
    render();
  }
}

async function refreshInstalledPluginSnapshot(options = {}) {
  if (!state.manifest) {
    return;
  }

  const snapshot = await loadInstalledPlugin(state.rootHandle, state.manifest, { t });
  state.existingInstallationDetected = Boolean(snapshot.installed);
  state.installedVersionChecked = Boolean(snapshot.installedVersionChecked);
  state.installedPluginVersion = snapshot.installedVersion ?? null;

  if (options.logWarnings ?? true) {
    for (const warning of snapshot.warnings) {
      pushLog(warning, "warning");
    }
  }

  if (options.logOutcome ?? false) {
    pushLog(snapshot.reason, snapshot.installed ? "info" : "warning");
  }
}

function supportsInstallation() {
  return window.isSecureContext && typeof window.showDirectoryPicker === "function";
}

function pushLog(message, tone = "info") {
  state.logs.push({
    message,
    tone,
  });
  renderLog();
}

function render() {
  renderVersionInfo();
  renderSupportNote();
  renderFolderDetails();
  renderLog();
  renderActionState();
}

function renderVersionInfo() {
  const installableVersion = getDisplayVersion(state.pluginVersion);
  let tone = "neutral";
  let message = t("page.version", {
    version: installableVersion,
  });

  if (state.installedVersionChecked) {
    const installedVersion = getDisplayVersion(state.installedPluginVersion);
    if (isVersionOutdated(state.installedPluginVersion, state.pluginVersion)) {
      tone = "warning";
      message = t("page.version.updateAvailable", {
        installedVersion,
        installableVersion,
      });
    } else {
      tone = "success";
      message = t("page.version.installed", {
        version: installedVersion,
      });
    }
  }

  setVersionStatusTone(tone);
  pluginVersion.textContent = message;
}

function getDisplayVersion(version) {
  return version ?? t("folder.unknown");
}

function setVersionStatusTone(tone) {
  pluginVersion.classList.remove(...VERSION_STATUS_TONE_CLASSES);
  pluginVersion.classList.add(`is-${tone}`);
}

function renderSupportNote() {
  if (!window.isSecureContext) {
    supportNote.textContent = t("support.secureContext");
    return;
  }

  if (typeof window.showDirectoryPicker !== "function") {
    supportNote.textContent = t("support.fileSystemApi");
    return;
  }

  if (!state.manifest) {
    supportNote.textContent = t("support.loadingBundle");
    return;
  }

  if (!state.rootHandle) {
    supportNote.textContent = t("support.selectFolder");
    return;
  }

  supportNote.textContent = state.inspection?.reason ?? t("support.readyToInspect");
}

function renderFolderDetails() {
  folderName.textContent = state.rootHandle?.name ?? t("folder.nothingSelected");
  folderStatus.textContent = state.inspection?.reason ?? t("folder.waitingForSelection");
  folderLayout.textContent = state.inspection?.layoutLabel ?? t("folder.unknown");
  pluginTarget.textContent = state.inspection?.pluginsDirPath ?? t("folder.unknown");
  pluginsFile.textContent = state.inspection?.pluginsFilePath ?? t("folder.unknown");

  packageList.textContent = "";

  const candidates = state.inspection?.packageCandidates ?? [];
  if (candidates.length === 0) {
    const item = document.createElement("li");
    item.textContent = t("package.noneInspected");
    packageList.append(item);
    return;
  }

  for (const candidate of candidates) {
    const item = document.createElement("li");
    item.textContent = `${candidate.path}: ${candidate.exists ? t("package.statusFound") : t("package.statusMissing")}`;
    packageList.append(item);
  }
}

function renderLog() {
  logList.textContent = "";

  const entries = state.logs.length > 0
    ? state.logs
    : [{ message: t("log.waitingForBundle"), tone: "info" }];

  for (const entry of entries) {
    const item = document.createElement("li");
    item.className = `log-entry ${entry.tone}`;
    item.textContent = entry.message;
    logList.append(item);
  }
}

function renderActionState() {
  pickFolderButton.disabled = state.busy || !supportsInstallation();
  installButton.disabled = state.busy || !canInstall();
  const reinstall = hasExistingInstallation();

  pickFolderButton.title = t("tooltip.pickFolderButton");
  installButton.title = t(reinstall ? "tooltip.reinstallButton" : "tooltip.installButton");

  installButton.textContent = state.busyAction === "install"
    ? t(reinstall ? "button.reinstalling" : "button.installing")
    : t(reinstall ? "button.reinstall" : "button.install");
}

function canInstall() {
  return Boolean(
    state.manifest
      && state.rootHandle
      && state.inspection?.valid
      && supportsInstallation(),
  );
}

function hasExistingInstallation() {
  return Boolean(state.existingInstallationDetected);
}
