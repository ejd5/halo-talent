// ─── Vitest Setup — Halo Companion ───────────
// Global mocks for Chrome Extension APIs, Web Crypto, IndexedDB

import { vi } from "vitest";

// ─── Chrome API Mock ──────────────────────────────────────

const chromeStorage = new Map<string, unknown>();

const chromeMock = {
  runtime: {
    id: "halo-companion-test",
    getURL: (path: string) => `chrome-extension://test/${path}`,
    sendMessage: vi.fn().mockResolvedValue({}),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    onInstalled: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    getManifest: () => ({
      manifest_version: 3,
      name: "Halo Companion",
      version: "1.0.0",
    }),
    lastError: undefined,
  },

  storage: {
    local: {
      get: vi.fn(async (keys?: string | string[] | Record<string, unknown>) => {
        if (typeof keys === "string") {
          const value = chromeStorage.get(keys);
          return { [keys]: value };
        }
        if (Array.isArray(keys)) {
          const result: Record<string, unknown> = {};
          for (const key of keys) {
            result[key] = chromeStorage.get(key);
          }
          return result;
        }
        if (typeof keys === "object" && keys !== null) {
          const result: Record<string, unknown> = {};
          for (const key of Object.keys(keys)) {
            result[key] = chromeStorage.get(key) ?? keys[key];
          }
          return result;
        }
        // No keys → return all
        const all: Record<string, unknown> = {};
        chromeStorage.forEach((v, k) => { all[k] = v; });
        return all;
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        for (const [key, value] of Object.entries(items)) {
          chromeStorage.set(key, value);
        }
      }),
      remove: vi.fn(async (keys: string | string[]) => {
        const keyList = Array.isArray(keys) ? keys : [keys];
        for (const key of keyList) {
          chromeStorage.delete(key);
        }
      }),
      clear: vi.fn(async () => {
        chromeStorage.clear();
      }),
    },
  },

  tabs: {
    query: vi.fn().mockResolvedValue([{ id: 1, url: "https://onlyfans.com/" }]),
    create: vi.fn().mockResolvedValue({ id: 2 }),
    sendMessage: vi.fn().mockResolvedValue({}),
  },

  alarms: {
    create: vi.fn(),
    clear: vi.fn(),
    onAlarm: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },

  notifications: {
    create: vi.fn(),
    clear: vi.fn(),
  },

  sidePanel: {
    open: vi.fn(),
    close: vi.fn(),
    setOptions: vi.fn(),
    getOptions: vi.fn().mockResolvedValue({}),
  },
};

// @ts-expect-error - partial mock
globalThis.chrome = chromeMock;

// Reset storage between tests
export function resetChromeStorage(): void {
  chromeStorage.clear();
}

// ─── Web Crypto Mock ─────────────────────────────────────

const cryptoMock = {
  getRandomValues: <T extends ArrayBufferView>(arr: T): T => {
    for (let i = 0; i < arr.byteLength; i++) {
      (arr as unknown as Uint8Array)[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  },
  subtle: {
    importKey: vi.fn().mockResolvedValue({ type: "secret", algorithm: "PBKDF2" }),
    deriveKey: vi.fn().mockResolvedValue({
      type: "secret",
      algorithm: { name: "AES-GCM", length: 256 },
      usages: ["encrypt", "decrypt"],
    }),
    encrypt: vi.fn().mockImplementation(async (_algo: unknown, _key: unknown, data: BufferSource) => {
      const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer);
      // Mock encryption: return a copy of data (not real encryption for tests)
      return bytes.buffer.slice(0);
    }),
    decrypt: vi.fn().mockImplementation(async (_algo: unknown, _key: unknown, data: BufferSource) => {
      const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer);
      return bytes.buffer.slice(0);
    }),
  },
  randomUUID: () => "00000000-0000-4000-8000-000000000000",
};

Object.defineProperty(globalThis, "crypto", {
  value: cryptoMock,
  writable: true,
  configurable: true,
});

// ─── IndexedDB Mock (simple in-memory) ────────────────────

const idbStore = new Map<string, Map<string, unknown>>();

class MockIDBRequest {
  result: unknown = undefined;
  error: Error | null = null;
  onsuccess: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onupgradeneeded: (() => void) | null = null;
  source: unknown = null;
  transaction: MockIDBTransaction | null = null;
}

class MockIDBTransaction {
  mode: IDBTransactionMode;
  objectStoreNames: DOMStringList;
  oncomplete: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(storeNames: string[], mode: IDBTransactionMode) {
    this.mode = mode;
    this.objectStoreNames = {
      length: storeNames.length,
      contains: (name: string) => storeNames.includes(name),
      item: (index: number) => storeNames[index] ?? null,
    } as DOMStringList;
  }

  objectStore(name: string): MockIDBObjectStore {
    return new MockIDBObjectStore(name, this);
  }
}

class MockIDBObjectStore {
  name: string;
  transaction: MockIDBTransaction;

  constructor(name: string, tx: MockIDBTransaction) {
    this.name = name;
    this.transaction = tx;
    if (!idbStore.has(name)) idbStore.set(name, new Map());
  }

  get(key: string): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.transaction;
    const store = idbStore.get(this.name)!;
    queueMicrotask(() => {
      req.result = store.get(key);
      req.onsuccess?.();
    });
    return req;
  }

  getAll(): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.transaction;
    const store = idbStore.get(this.name)!;
    queueMicrotask(() => {
      req.result = Array.from(store.values());
      req.onsuccess?.();
    });
    return req;
  }

  put(value: unknown, key?: string): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.transaction;
    const store = idbStore.get(this.name)!;
    const record = value as Record<string, unknown>;
    const k = key ?? (record.id as string ?? record.timestamp as string);
    store.set(String(k), value);
    req.onsuccess?.();
    return req;
  }

  delete(key: string): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.transaction;
    const store = idbStore.get(this.name)!;
    store.delete(key);
    req.onsuccess?.();
    return req;
  }

  clear(): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.transaction;
    const store = idbStore.get(this.name)!;
    store.clear();
    req.onsuccess?.();
    return req;
  }

  count(): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.transaction;
    const store = idbStore.get(this.name)!;
    queueMicrotask(() => {
      req.result = store.size;
      req.onsuccess?.();
    });
    return req;
  }

  index(name: string): MockIDBIndex {
    return new MockIDBIndex(name, this);
  }
}

class MockIDBIndex {
  name: string;
  objectStore: MockIDBObjectStore;

  constructor(name: string, store: MockIDBObjectStore) {
    this.name = name;
    this.objectStore = store;
  }

  openCursor(): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.objectStore.transaction;
    const store = idbStore.get(this.objectStore.name)!;
    const entries = Array.from(store.entries());
    let idx = 0;

    const fireCursor = () => {
      if (idx < entries.length) {
        req.result = {
          primaryKey: entries[idx][0],
          value: entries[idx][1],
          continue: () => {
            idx++;
            queueMicrotask(fireCursor);
          },
        };
      } else {
        req.result = null;
      }
      req.onsuccess?.();
    };

    queueMicrotask(fireCursor);
    return req;
  }

  getAll(_query?: unknown): MockIDBRequest {
    const req = new MockIDBRequest();
    req.transaction = this.objectStore.transaction;
    const store = idbStore.get(this.objectStore.name)!;
    queueMicrotask(() => {
      req.result = Array.from(store.values());
      req.onsuccess?.();
    });
    return req;
  }
}

// Override indexedDB with mock
const mockIndexedDB = {
  open(_name: string, _version?: number): MockIDBRequest {
    const req = new MockIDBRequest();
    queueMicrotask(() => {
      const db = {
        objectStoreNames: {
          contains: (name: string) => idbStore.has(name),
        } as unknown as DOMStringList,
        createObjectStore: (name: string) => {
          if (!idbStore.has(name)) idbStore.set(name, new Map());
          return { createIndex: () => {} };
        },
        transaction: (storeNames: string | string[], mode?: string) => {
          const names = Array.isArray(storeNames) ? storeNames : [storeNames];
          const tx = new MockIDBTransaction(names, (mode as IDBTransactionMode) ?? "readwrite");
          tx.objectStore = (name: string): MockIDBObjectStore => {
            const store = idbStore.get(name);
            if (!store) throw new Error(`Object store '${name}' not found`);
            const mockStore = new MockIDBObjectStore(name, undefined as unknown as MockIDBTransaction);
            mockStore.transaction = tx;
            return mockStore;
          };
          setTimeout(() => tx.oncomplete?.(), 0);
          return tx as unknown as IDBTransaction;
        },
        close: () => {},
      };
      req.result = db;
      req.onupgradeneeded?.();
      req.onsuccess?.();
    });
    return req;
  },
};

// Only mock if not in a browser environment
if (typeof indexedDB === "undefined") {
  // @ts-expect-error - mock indexedDB
  globalThis.indexedDB = mockIndexedDB;
}

// ─── DOM Helpers ──────────────────────────────────────────

/** Create a basic DOM structure for testing platform adapters */
export function createMockPlatformDOM(platform: "onlyfans" | "fansly" | "mym"): HTMLElement {
  document.body.innerHTML = "";

  if (platform === "onlyfans") {
    document.body.innerHTML = `
      <div class="b-profile-header">
        <h1>Sarah_VIP</h1>
        <span class="b-profile-header__name">Sarah</span>
        <span class="b-profile-header__total-spent">$890.00</span>
      </div>
      <div class="b-chat">
        <div class="b-chat__header">
          <span class="b-chat__header-name">Sarah</span>
        </div>
        <div class="b-chat__messages">
          <div class="b-chat__message b-chat__message--inbound">
            <span class="b-chat__message-text">Hello!</span>
            <span class="b-chat__message-time">2 min ago</span>
          </div>
        </div>
        <div class="b-chat__input">
          <div contenteditable="true" class="b-chat__input-field"></div>
          <button class="b-chat__send-btn">Send</button>
        </div>
      </div>
      <div class="b-dashboard">
        <div class="b-stat">Revenue: $12,340</div>
        <div class="b-stat">Fans: 1,234</div>
      </div>
      <a href="/u/sarah_vip">Sarah_VIP</a>
    `;
  }

  return document.body;
}

/** Reset all mocks between tests */
export function resetAllMocks(): void {
  vi.clearAllMocks();
  resetChromeStorage();
  idbStore.clear();
  document.body.innerHTML = "";
}
