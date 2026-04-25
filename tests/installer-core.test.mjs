import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  injectPluginEntry,
  installGame,
  isVersionOutdated,
  loadInstalledPlugin,
  loadVersionInfo,
  patchEmptyPackageName,
} from "../installer-core.mjs";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDirectory, "..");

test("patchEmptyPackageName only updates empty name fields", () => {
  const changed = patchEmptyPackageName('{"name":"","window":{"title":"Demo"}}');
  assert.equal(changed.changed, true);
  assert.equal(changed.text, '{"name":"Game","window":{"title":"Demo"}}');

  const untouched = patchEmptyPackageName('{"name":"Already Set"}');
  assert.equal(untouched.changed, false);
  assert.equal(untouched.text, '{"name":"Already Set"}');
});

test("injectPluginEntry inserts the CheatBridge entry once", () => {
  const entry = '{"name":"CheatBridge","status":true,"description":"Entry point","parameters":{}},';
  const injected = injectPluginEntry('[{"name":"AnotherPlugin"}]', entry);
  assert.equal(injected.changed, true);
  assert.equal(
    injected.text,
    `[${entry}{"name":"AnotherPlugin"}]`,
  );

  const alreadyPresent = injectPluginEntry(`[${entry}]`, entry);
  assert.equal(alreadyPresent.changed, false);
  assert.equal(alreadyPresent.alreadyPresent, true);
});

test("loadVersionInfo returns the bundled version when version.json is present", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(options?.cache, "no-store");
    return createFetchResponse({
      "/version.json": JSON.stringify({ version: "1.12" }),
    }, url);
  };

  try {
    const version = await loadVersionInfo("https://example.test/version.json");
    assert.equal(version, "1.12");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("loadVersionInfo returns null when version.json is missing", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => createFetchResponse({}, url);

  try {
    const version = await loadVersionInfo("https://example.test/version.json");
    assert.equal(version, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("isVersionOutdated compares installed version against installable version", () => {
  assert.equal(isVersionOutdated("2.3", "2.4"), true);
  assert.equal(isVersionOutdated("2.10", "2.9"), true);
  assert.equal(isVersionOutdated("2.3.0", "2.3"), true);
  assert.equal(isVersionOutdated(null, "2.4"), true);
  assert.equal(isVersionOutdated("local_debug", "local_debug"), false);
  assert.equal(isVersionOutdated("2.3", null), false);
});

test("installGame copies CheatBridge and cheat-engine support files", async () => {
  const rootHandle = createFakeDirectory("Game");
  const jsHandle = rootHandle.addDirectory("js");
  const pluginsHandle = jsHandle.addDirectory("plugins");

  rootHandle.setFileText("package.json", '{"name":"Game"}\n');
  jsHandle.setFileText("plugins.js", "[]\n");

  const manifest = {
    bundleDirectory: "cheat-engine",
    loaderFile: "CheatBridge.js",
    supportDirectory: "cheat-engine",
    supportFiles: [
      "init/import.js",
      "init/setup.js",
      "MainComponent.js",
    ],
    pluginEntry: '{"name":"CheatBridge","status":true,"description":"Entry point","parameters":{}},',
  };

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => createFetchResponse({
    "/version.json": JSON.stringify({ version: "2.4" }),
    "/cheat-engine/CheatBridge.js": 'console.log("bridge");\n',
    "/cheat-engine/init/import.js": 'console.log("import");\n',
    "/cheat-engine/init/setup.js": 'console.log("setup");\n',
    "/cheat-engine/MainComponent.js": 'console.log("main");\n',
  }, url);

  let result;
  try {
    result = await installGame(rootHandle, manifest, {
      baseUrl: "https://example.test/app.mjs",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  const supportHandle = pluginsHandle.getDirectory("cheat-engine");
  assert.equal(pluginsHandle.readFileText("CheatBridge.js"), 'console.log("bridge");\n');
  assert.equal(supportHandle.readFileTextAtPath("init/import.js"), 'console.log("import");\n');
  assert.equal(supportHandle.readFileTextAtPath("init/setup.js"), 'console.log("setup");\n');
  assert.equal(supportHandle.readFileText("MainComponent.js"), 'console.log("main");\n');
  assert.equal(supportHandle.readFileText("version.json"), JSON.stringify({ version: "2.4" }));
  assert.equal(jsHandle.readFileText("plugins.js"), `[${manifest.pluginEntry}]\n`);
  assert.equal(result.filesCopied, manifest.supportFiles.length + 2);
});

test("loadInstalledPlugin reports the installed version file", async () => {
  const rootHandle = createFakeDirectory("Game");
  const jsHandle = rootHandle.addDirectory("js");
  const pluginsHandle = jsHandle.addDirectory("plugins");
  const supportHandle = pluginsHandle.addDirectory("cheat-engine");

  jsHandle.setFileText("plugins.js", "[]\n");
  supportHandle.setFileText("version.json", JSON.stringify({ version: "2.3" }));

  const manifest = {
    bundleDirectory: "cheat-engine",
    loaderFile: "CheatBridge.js",
    supportDirectory: "cheat-engine",
    supportFiles: ["init/import.js"],
    pluginEntry: '{"name":"CheatBridge","status":true,"description":"Entry point","parameters":{}},',
  };

  const snapshot = await loadInstalledPlugin(rootHandle, manifest);

  assert.equal(snapshot.installed, true);
  assert.equal(snapshot.installedVersionChecked, true);
  assert.equal(snapshot.installedVersion, "2.3");
});

test("installer-manifest.json tracks the copied support bundle", async () => {
  const manifestPath = path.join(repoRoot, "installer-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  const bundleDirectory = path.join(repoRoot, manifest.bundleDirectory);
  const excludedFiles = new Set([manifest.loaderFile]);
  const copiedFiles = (await listRelativeFiles(bundleDirectory))
    .filter((name) => !excludedFiles.has(name))
    .sort();

  const manifestFiles = [...manifest.supportFiles].sort();
  assert.deepEqual(manifestFiles, copiedFiles);
});

async function listRelativeFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      return listRelativeFiles(path.join(directory, entry.name), relativePath);
    }

    if (entry.isFile()) {
      return [relativePath];
    }

    return [];
  }));

  return files.flat();
}

function createFetchResponse(assets, url) {
  const pathname = new URL(String(url)).pathname;
  const body = assets[pathname];

  if (typeof body === "undefined") {
    return {
      ok: false,
      status: 404,
      async text() {
        return "";
      },
      async arrayBuffer() {
        return new ArrayBuffer(0);
      },
    };
  }

  return {
    ok: true,
    status: 200,
    async json() {
      return JSON.parse(body);
    },
    async text() {
      return body;
    },
    async arrayBuffer() {
      return new TextEncoder().encode(body).buffer;
    },
  };
}

function createFakeDirectory(name) {
  return new FakeDirectoryHandle(name);
}

class FakeDirectoryHandle {
  constructor(name) {
    this.name = name;
    this.directories = new Map();
    this.files = new Map();
  }

  addDirectory(name) {
    const directory = new FakeDirectoryHandle(name);
    this.directories.set(name, directory);
    return directory;
  }

  getDirectory(name) {
    const directory = this.directories.get(name);
    if (!directory) {
      throw new Error(`Missing fake directory: ${name}`);
    }

    return directory;
  }

  setFileText(name, text) {
    this.files.set(name, new TextEncoder().encode(text));
  }

  readFileText(name) {
    const bytes = this.files.get(name);
    if (!bytes) {
      throw new Error(`Missing fake file: ${name}`);
    }

    return new TextDecoder().decode(bytes);
  }

  readFileTextAtPath(filePath) {
    const segments = filePath.split(/[\\/]+/);
    let directory = this;

    for (const directoryName of segments.slice(0, -1)) {
      directory = directory.getDirectory(directoryName);
    }

    return directory.readFileText(segments[segments.length - 1]);
  }

  async getDirectoryHandle(name, options = {}) {
    const existingDirectory = this.directories.get(name);
    if (existingDirectory) {
      return existingDirectory;
    }

    if (options.create) {
      return this.addDirectory(name);
    }

    throw createNotFoundError();
  }

  async getFileHandle(name, options = {}) {
    if (this.files.has(name)) {
      return new FakeFileHandle(this, name);
    }

    if (options.create) {
      this.setFileText(name, "");
      return new FakeFileHandle(this, name);
    }

    throw createNotFoundError();
  }
}

class FakeFileHandle {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
  }

  async getFile() {
    const bytes = this.parent.files.get(this.name);
    return {
      async arrayBuffer() {
        const copy = new Uint8Array(bytes);
        return copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.byteLength);
      },
    };
  }

  async createWritable() {
    return {
      write: async (value) => {
        this.parent.files.set(this.name, normalizeWritableValue(value));
      },
      close: async () => {},
    };
  }
}

function normalizeWritableValue(value) {
  if (value instanceof Uint8Array) {
    return new Uint8Array(value);
  }

  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (typeof value === "string") {
    return new TextEncoder().encode(value);
  }

  throw new TypeError(`Unsupported writable value: ${typeof value}`);
}

function createNotFoundError() {
  const error = new Error("Not found");
  error.name = "NotFoundError";
  return error;
}
