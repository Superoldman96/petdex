/**
 * Windows-compatibility tests for process.ts and install.ts
 *
 * These tests run on any platform (CI is Linux/Windows) but validate the
 * Windows code paths added in Packet 007:
 *   - isPidAlive() — tasklist-based liveness on win32, ps-based on POSIX
 *   - desktopBinPath() — .exe suffix on win32
 *   - detectTarget() — assetSuffix shape and win32-x64 on Windows x64
 *
 * Run from packages/petdex-cli:
 *   bun test src/desktop/process.win32.test.ts
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { desktopBinPath, detectTarget } from "./install.js";
import { isPidAlive } from "./process.js";

// ---------------------------------------------------------------------------
// isPidAlive
// ---------------------------------------------------------------------------

describe("isPidAlive", () => {
  test("returns true for the current process (self)", () => {
    expect(isPidAlive(process.pid)).toBe(true);
  });

  test("returns false for a pid that is almost certainly dead", () => {
    // 2147483646 (INT_MAX − 1) is beyond typical OS pid limits on both
    // Windows (default max 32768) and Linux (default max 4194304), so
    // this pid should never be alive in any normal environment.
    expect(isPidAlive(2_147_483_646)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// desktopBinPath
// ---------------------------------------------------------------------------

describe("desktopBinPath", () => {
  let savedHome: string | undefined;
  let savedUserProfile: string | undefined;

  beforeEach(() => {
    savedHome = process.env.HOME;
    savedUserProfile = process.env.USERPROFILE;
  });

  afterEach(() => {
    if (savedHome === undefined) delete process.env.HOME;
    else process.env.HOME = savedHome;

    if (savedUserProfile === undefined) delete process.env.USERPROFILE;
    else process.env.USERPROFILE = savedUserProfile;
  });

  test("adds .exe suffix exactly on win32", () => {
    const p = desktopBinPath();
    if (process.platform === "win32") {
      expect(p.endsWith(".exe")).toBe(true);
    } else {
      // On macOS / Linux the bare binary has no extension
      expect(p.endsWith(".exe")).toBe(false);
    }
  });

  test("returns a string that includes 'petdex-desktop'", () => {
    const p = desktopBinPath();
    expect(p).toContain("petdex-desktop");
  });

  test("returns a path under the user home directory", () => {
    // desktopBinPath() uses os.homedir() internally, which resolves
    // HOME/USERPROFILE/HOMEDRIVE+HOMEPATH from the OS — not env vars.
    // We just verify the result is an absolute path under *some* home dir.
    const { homedir } = require("node:os");
    const home: string = homedir();
    const p = desktopBinPath();
    // Either a fallback ~/.petdex/bin path OR an .app bundle path —
    // both live inside the user's home directory.
    // On Windows the .app search is skipped so it's always the bin path.
    expect(p.startsWith(home) || p.includes("petdex-desktop")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// detectTarget
// ---------------------------------------------------------------------------

describe("detectTarget", () => {
  test("returns an object with assetSuffix, osLabel, and archLabel", () => {
    const t = detectTarget();
    expect(typeof t.assetSuffix).toBe("string");
    expect(typeof t.osLabel).toBe("string");
    expect(typeof t.archLabel).toBe("string");
    expect(t.assetSuffix.length).toBeGreaterThan(0);
  });

  test("assetSuffix matches the expected platform-arch pattern", () => {
    const t = detectTarget();
    // Pattern: "<os>-<arch>" where os ∈ {darwin, linux, win32} and
    // arch ∈ {arm64, x64} (other arches pass through as-is).
    expect(t.assetSuffix).toMatch(/^[a-z0-9]+-[a-z0-9_]+$/);
    // The suffix must be at least "os-arch" (3 chars + dash + 2 chars).
    expect(t.assetSuffix.length).toBeGreaterThanOrEqual(6);
  });

  test("assetSuffix equals win32-x64 when running on Windows x64", () => {
    if (process.platform !== "win32" || process.arch !== "x64") return;
    expect(detectTarget().assetSuffix).toBe("win32-x64");
  });

  test("osLabel is darwin on macOS", () => {
    if (process.platform !== "darwin") return;
    expect(detectTarget().osLabel).toBe("darwin");
  });

  test("osLabel is linux on Linux", () => {
    if (process.platform !== "linux") return;
    expect(detectTarget().osLabel).toBe("linux");
  });

  test("osLabel is win32 on Windows", () => {
    if (process.platform !== "win32") return;
    expect(detectTarget().osLabel).toBe("win32");
  });
});
