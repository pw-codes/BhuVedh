export type Draft = { clientId: string; springId: number; kind: string; value: string; note: string; lat: number | null; lon: number | null; photo: string | null; observedAt: string };
const open = () => new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open("bhuvedh", 1);
  r.onupgradeneeded = () => r.result.createObjectStore("q", { keyPath: "clientId" });
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
});
const run = async <T,>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>) => {
  const db = await open();
  return new Promise<T>((res, rej) => { const r = f(db.transaction("q", mode).objectStore("q")); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
};
export const enqueue = (d: Draft) => run("readwrite", (s) => s.put(d));
export const pending = () => run<Draft[]>("readonly", (s) => s.getAll());
const drop = (id: string) => run("readwrite", (s) => s.delete(id));

/** Sends queued observations. Server dedupes on clientId, so retries are safe. Returns count synced. */
export async function flush(): Promise<number> {
  const items = await pending();
  if (!items.length) return 0;
  const r = await fetch("/api/observations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(items) });
  if (!r.ok) throw new Error("Server rejected sync");
  const { saved } = (await r.json()) as { saved: string[] };
  await Promise.all(saved.map(drop));
  return saved.length;
}
