import { createTranslator } from "./i18n.mjs";

export const LOADER_PLUGIN_NAME = "CheatBridge";
export const VERSION_FILE_NAME = "version.json";

const DEFAULT_T = createTranslator("en");

export function patchEmptyPackageName(text) {
  if (!/("name"\s*:\s*)""/.test(text)) {
    return { changed: false, text };
  }

  return {
    changed: true,
    text: text.replace(/("name"\s*:\s*)""/, '$1"Game"'),
  };
}

export function injectPluginEntry(text, entry, warningMessage = "Unable to inject plugin entry into plugins.js automatically.") {
  if (text.includes(LOADER_PLUGIN_NAME)) {
    return { changed: false, alreadyPresent: true, text };
  }

  const updated = text.replace(/\[/, `[${entry}`);
  if (updated === text) {
    return {
      changed: false,
      alreadyPresent: false,
      text,
      warning: warningMessage,
    };
  }

  return {
    changed: true,
    alreadyPresent: false,
    text: updated,
  };
}

export async function loadManifest(url = new URL("./installer-manifest.json", import.meta.url), options = {}) {
  const t = getTranslator(options);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(t("core.loadManifestFailed", { status: response.status }));
  }

  return response.json();
}

export async function loadVersionInfo(url = new URL("./version.json", import.meta.url)) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const version = typeof data?.version === "string"
      ? data.version.trim()
      : "";

    return version || null;
  } catch {
    return null;
  }
}

export async function loadInstalledPlugin(rootHandle, manifest, options = {}) {
  const t = getTranslator(options);
  if (!rootHandle) {
    return {
      installed: false,
      installedVersionChecked: false,
      installedVersion: null,
      supportDirectoryPath: null,
      reason: t("core.selectFolderToInspectInstall"),
      warnings: [],
    };
  }

  const inspection = await inspectGameDirectory(rootHandle, { t });
  if (!inspection.valid) {
    return {
      installed: false,
      installedVersionChecked: false,
      installedVersion: null,
      supportDirectoryPath: null,
      reason: inspection.reason,
      warnings: [],
    };
  }

  const supportDirectoryPath = `${inspection.pluginsDirPath}/${manifest.supportDirectory}`;
  const supportDirHandle = await tryGetDirectoryHandle(
    inspection.pluginsDirHandle,
    manifest.supportDirectory,
  );
  if (!supportDirHandle) {
    return {
      installed: false,
      installedVersionChecked: false,
      installedVersion: null,
      supportDirectoryPath,
      reason: t("core.noInstalledPlugin", { path: supportDirectoryPath }),
      warnings: [],
    };
  }

  const versionInfo = await loadInstalledVersionInfo(
    supportDirHandle,
    `${supportDirectoryPath}/${VERSION_FILE_NAME}`,
    t,
  );

  return {
    installed: true,
    installedVersionChecked: true,
    installedVersion: versionInfo.version,
    supportDirectoryPath,
    reason: t("core.installedPluginFound", { path: supportDirectoryPath }),
    warnings: versionInfo.warnings,
  };
}

export function isVersionOutdated(installedVersion, installableVersion) {
  const installable = normalizeVersion(installableVersion);
  if (!installable) {
    return false;
  }

  return normalizeVersion(installedVersion) !== installable;
}

export async function ensureReadWritePermission(handle) {
  if (!handle?.queryPermission || !handle?.requestPermission) {
    return true;
  }

  const options = { mode: "readwrite" };
  if ((await handle.queryPermission(options)) === "granted") {
    return true;
  }

  return (await handle.requestPermission(options)) === "granted";
}

export async function inspectGameDirectory(rootHandle, options = {}) {
  const t = getTranslator(options);
  const packageCandidates = [];
  const rootPackageHandle = await tryGetFileHandle(rootHandle, "package.json");
  packageCandidates.push({
    path: "package.json",
    fileName: "package.json",
    parentHandle: rootHandle,
    handle: rootPackageHandle,
    exists: Boolean(rootPackageHandle),
  });

  const wwwHandle = await tryGetDirectoryHandle(rootHandle, "www");
  if (wwwHandle) {
    const wwwPackageHandle = await tryGetFileHandle(wwwHandle, "package.json");
    packageCandidates.push({
      path: "www/package.json",
      fileName: "package.json",
      parentHandle: wwwHandle,
      handle: wwwPackageHandle,
      exists: Boolean(wwwPackageHandle),
    });
  } else {
    packageCandidates.push({
      path: "www/package.json",
      fileName: "package.json",
      parentHandle: null,
      handle: null,
      exists: false,
    });
  }

  const candidates = [];
  if (wwwHandle) {
    const wwwJsHandle = await tryGetDirectoryHandle(wwwHandle, "js");
    const wwwPluginsDirHandle = wwwJsHandle
      ? await tryGetDirectoryHandle(wwwJsHandle, "plugins")
      : null;

    if (wwwPluginsDirHandle) {
      candidates.push({
        layoutLabel: "www/js/plugins",
        pluginsDirPath: "www/js/plugins",
        pluginsFilePath: "www/js/plugins.js",
        jsDirHandle: wwwJsHandle,
        pluginsDirHandle: wwwPluginsDirHandle,
        pluginsFileHandle: wwwJsHandle
          ? await tryGetFileHandle(wwwJsHandle, "plugins.js")
          : null,
      });
    }
  }

  const jsHandle = await tryGetDirectoryHandle(rootHandle, "js");
  const rootPluginsDirHandle = jsHandle ? await tryGetDirectoryHandle(jsHandle, "plugins") : null;
  if (rootPluginsDirHandle) {
    candidates.push({
      layoutLabel: "js/plugins",
      pluginsDirPath: "js/plugins",
      pluginsFilePath: "js/plugins.js",
      jsDirHandle: jsHandle,
      pluginsDirHandle: rootPluginsDirHandle,
      pluginsFileHandle: jsHandle ? await tryGetFileHandle(jsHandle, "plugins.js") : null,
    });
  }

  const selectedLayout = candidates[0] ?? null;
  if (!selectedLayout) {
    return {
      valid: false,
      rootName: rootHandle.name,
      layoutLabel: t("folder.unknown"),
      pluginsDirPath: t("folder.missing"),
      pluginsFilePath: t("folder.missing"),
      packageCandidates,
      reason: t("core.couldNotFindPlugins"),
    };
  }

  if (!selectedLayout.pluginsFileHandle) {
    return {
      valid: false,
      rootName: rootHandle.name,
      layoutLabel: selectedLayout.layoutLabel,
      pluginsDirPath: selectedLayout.pluginsDirPath,
      pluginsFilePath: selectedLayout.pluginsFilePath,
      packageCandidates,
      reason: t("core.foundPluginsButMissingFile", {
        pluginsDirPath: selectedLayout.pluginsDirPath,
        pluginsFilePath: selectedLayout.pluginsFilePath,
      }),
    };
  }

  return {
    valid: true,
    rootName: rootHandle.name,
    layoutLabel: selectedLayout.layoutLabel,
    pluginsDirPath: selectedLayout.pluginsDirPath,
    pluginsFilePath: selectedLayout.pluginsFilePath,
    packageCandidates,
    jsDirHandle: selectedLayout.jsDirHandle,
    pluginsDirHandle: selectedLayout.pluginsDirHandle,
    pluginsFileHandle: selectedLayout.pluginsFileHandle,
    reason: t("core.readyToInstall"),
  };
}

export async function installGame(rootHandle, manifest, options = {}) {
  const baseUrl = options.baseUrl ?? import.meta.url;
  const log = options.log ?? (() => {});
  const t = getTranslator(options);
  const inspection = await inspectGameDirectory(rootHandle, { t });
  if (!inspection.valid) {
    throw new Error(inspection.reason);
  }

  const bundle = await fetchInstallerBundle(manifest, baseUrl, t);
  log(t("core.detectedFolderStructure", { layout: inspection.layoutLabel }), "info");

  let foundAnyPackage = false;
  let packageUpdates = 0;
  for (const candidate of inspection.packageCandidates) {
    if (!candidate.exists || !candidate.handle || !candidate.parentHandle) {
      continue;
    }

    foundAnyPackage = true;

    try {
      const packageData = await readTextFile(candidate.handle);
      const packageJson = JSON.parse(packageData.text);
      const hasNameProperty = Object.prototype.hasOwnProperty.call(packageJson, "name");
      const currentName = hasNameProperty ? String(packageJson.name ?? "") : null;

      if (hasNameProperty && currentName !== null && currentName.trim() === "") {
        log(t("core.foundEmptyName", { path: candidate.path }), "warning");

        const backupFileName = `${candidate.fileName}.backup`;
        const backupHandle = await tryGetFileHandle(candidate.parentHandle, backupFileName);
        if (!backupHandle) {
          const createdBackupHandle = await candidate.parentHandle.getFileHandle(backupFileName, {
            create: true,
          });
          await writeBytes(createdBackupHandle, packageData.bytes);
          log(t("core.backupCreated", { path: `${candidate.path}.backup` }), "info");
        }

        const patchedPackage = patchEmptyPackageName(packageData.text);
        if (patchedPackage.changed) {
          await writeTextFile(candidate.handle, patchedPackage.text, packageData.hasBom);
          packageUpdates += 1;
          log(t("core.updatedName", { path: candidate.path }), "success");
        }
      } else if (hasNameProperty && currentName.trim() !== "") {
        log(t("core.nameAlreadySet", {
          path: candidate.path,
          name: currentName,
        }), "info");
      } else {
        log(t("core.noEmptyName", { path: candidate.path }), "info");
      }
    } catch (error) {
      log(t("core.couldNotProcessPackage", {
        path: candidate.path,
        message: error.message,
      }), "warning");
    }
  }

  if (!foundAnyPackage) {
    log(t("core.packageJsonNotFound"), "warning");
  }

  const loaderHandle = await inspection.pluginsDirHandle.getFileHandle(manifest.loaderFile, {
    create: true,
  });
  await writeBytes(loaderHandle, bundle.loader.bytes);
  log(t("core.copiedLoader", {
    fileName: manifest.loaderFile,
    path: inspection.pluginsDirPath,
  }), "success");

  const existingSupportDir = await tryGetDirectoryHandle(
    inspection.pluginsDirHandle,
    manifest.supportDirectory,
  );
  const supportDirHandle = existingSupportDir
    ?? (await inspection.pluginsDirHandle.getDirectoryHandle(manifest.supportDirectory, {
      create: true,
    }));

  if (!existingSupportDir) {
    log(t("core.createdSupportDirectory", {
      path: `${inspection.pluginsDirPath}/${manifest.supportDirectory}`,
    }), "info");
  }

  let supportFilesCopied = 0;
  for (const file of bundle.supportFiles) {
    const supportFileHandle = await getFileHandleAtPath(supportDirHandle, file.name, { create: true });
    await writeBytes(supportFileHandle, file.bytes);
    supportFilesCopied += 1;
    log(t("core.copiedSupportFile", {
      fileName: file.name,
      path: `${inspection.pluginsDirPath}/${manifest.supportDirectory}`,
    }), "success");
  }

  const versionFileHandle = await supportDirHandle.getFileHandle(bundle.version.name, {
    create: true,
  });
  await writeBytes(versionFileHandle, bundle.version.bytes);
  log(t("core.copiedVersionFile", {
    fileName: bundle.version.name,
    path: `${inspection.pluginsDirPath}/${manifest.supportDirectory}`,
  }), "success");

  const pluginsData = await readTextFile(inspection.pluginsFileHandle);
  let pluginEntryAdded = false;

  if (pluginsData.text.includes(LOADER_PLUGIN_NAME)) {
    log(t("core.pluginEntryAlreadyExists", { path: inspection.pluginsFilePath }), "info");
  } else {
    log(t("core.addingPluginEntry", { path: inspection.pluginsFilePath }), "info");

    const pluginsBackupHandle = await inspection.jsDirHandle.getFileHandle("plugins.js.backup", {
      create: true,
    });
    await writeBytes(pluginsBackupHandle, pluginsData.bytes);
    log(t("core.backupCreated", { path: `${inspection.pluginsFilePath}.backup` }), "info");

    const updatedPlugins = injectPluginEntry(
      pluginsData.text,
      manifest.pluginEntry,
      t("core.injectPluginEntryFailure"),
    );
    if (!updatedPlugins.changed) {
      throw new Error(updatedPlugins.warning);
    }

    await writeTextFile(inspection.pluginsFileHandle, updatedPlugins.text, pluginsData.hasBom);
    pluginEntryAdded = true;
    log(t("core.pluginEntryAdded", { path: inspection.pluginsFilePath }), "success");
  }

  return {
    packageUpdates,
    pluginEntryAdded,
    filesCopied: 2 + supportFilesCopied,
    supportDirectory: `${inspection.pluginsDirPath}/${manifest.supportDirectory}`,
  };
}

async function fetchInstallerBundle(manifest, baseUrl, t) {
  const bundleDirectory = manifest.bundleDirectory.replace(/\/+$/, "");
  const loader = {
    name: manifest.loaderFile,
    bytes: await fetchAssetBytes(new URL(`${bundleDirectory}/${manifest.loaderFile}`, baseUrl), t),
  };
  const version = {
    name: VERSION_FILE_NAME,
    bytes: await fetchAssetBytes(new URL(`./${VERSION_FILE_NAME}`, baseUrl), t),
  };

  const supportFiles = await Promise.all(
    manifest.supportFiles.map(async (name) => {
      const normalizedName = normalizeSupportFilePath(name);
      return {
        name: normalizedName,
        bytes: await fetchAssetBytes(new URL(`${bundleDirectory}/${normalizedName}`, baseUrl), t),
      };
    }),
  );

  return { loader, supportFiles, version };
}

async function loadInstalledVersionInfo(supportDirHandle, versionPath, t) {
  const versionHandle = await tryGetFileHandle(supportDirHandle, VERSION_FILE_NAME);
  if (!versionHandle) {
    return {
      version: null,
      warnings: [],
    };
  }

  try {
    const data = await readTextFile(versionHandle);
    const parsed = JSON.parse(data.text);
    const version = normalizeVersion(parsed?.version);

    return {
      version,
      warnings: [],
    };
  } catch (error) {
    return {
      version: null,
      warnings: [t("core.couldNotParseVersion", {
        path: versionPath,
        message: error.message,
      })],
    };
  }
}

async function fetchAssetBytes(url, t) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(t("core.fetchAssetFailed", {
      path: url.pathname,
      status: response.status,
    }));
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function readTextFile(fileHandle) {
  const file = await fileHandle.getFile();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  const decoder = new TextDecoder("utf-8");
  let text = decoder.decode(bytes);
  if (hasBom && text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  return { bytes, text, hasBom };
}

async function writeTextFile(fileHandle, text, hasBom) {
  const encodedText = encodeTextBytes(text);
  const bytes = hasBom
    ? prependUtf8Bom(encodedText)
    : encodedText;

  await writeBytes(fileHandle, bytes);
}

async function writeBytes(fileHandle, bytes) {
  const writable = await fileHandle.createWritable();
  await writable.write(bytes);
  await writable.close();
}

function prependUtf8Bom(bytes) {
  const output = new Uint8Array(bytes.length + 3);
  output.set([0xef, 0xbb, 0xbf], 0);
  output.set(bytes, 3);
  return output;
}

function encodeTextBytes(text) {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

function normalizeVersion(version) {
  return typeof version === "string" ? version.trim() || null : null;
}

function getTranslator(options = {}) {
  return typeof options.t === "function" ? options.t : DEFAULT_T;
}

async function tryGetDirectoryHandle(parentHandle, name) {
  try {
    return await parentHandle.getDirectoryHandle(name);
  } catch (error) {
    if (error?.name === "NotFoundError") {
      return null;
    }
    throw error;
  }
}

async function tryGetFileHandle(parentHandle, name) {
  try {
    return await parentHandle.getFileHandle(name);
  } catch (error) {
    if (error?.name === "NotFoundError") {
      return null;
    }
    throw error;
  }
}

async function getFileHandleAtPath(parentHandle, filePath, options = {}) {
  const segments = getSupportPathSegments(filePath);
  let directoryHandle = parentHandle;

  for (const directoryName of segments.slice(0, -1)) {
    directoryHandle = await directoryHandle.getDirectoryHandle(
      directoryName,
      options.create ? { create: true } : {},
    );
  }

  return directoryHandle.getFileHandle(segments[segments.length - 1], options);
}

function getSupportPathSegments(filePath) {
  return normalizeSupportFilePath(filePath).split("/");
}

function normalizeSupportFilePath(filePath) {
  const normalizedPath = String(filePath ?? "").trim().replace(/\\/g, "/");
  const segments = normalizedPath.split("/");

  if (
    !normalizedPath
      || segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new Error(`Invalid support file path in installer manifest: ${filePath}`);
  }

  return segments.join("/");
}
