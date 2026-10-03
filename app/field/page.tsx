"use client";
import { useEffect, useState } from "react";
import { enqueue, flush, pending } from "@/lib/queue";
import dynamic from "next/dynamic";
import { compress } from "@/lib/photo";
import { saveArea, tileUrls } from "@/lib/offlineTiles";
import type { Site } from "../page";
import Brand from "@/components/Brand";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const KINDS = [
  ["dye_trace", "Dye trace result"],
  ["isotope", "Isotope sample"],
  ["ec_temp", "EC / temperature"],
  ["discharge", "Discharge measurement"],
  ["lineament", "Lineament or fracture seen"],
];

export default function Field() {
  const [sites, setSites] = useState<Site[]>([]);
  const [springId, setSpringId] = useState(0);
  const [kind, setKind] = useState("dye_trace");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [tiles, setTiles] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [queued, setQueued] = useState(0);
  const [online, setOnline] = useState(true);
  const [msg, setMsg] = useState("");

  const refresh = () => pending().then((p) => setQueued(p.length));
  const sync = async () => {
    try {
      const n = await flush();
      if (n) setMsg(`Synced ${n} observation(s).`);
    } catch {
      setMsg("Sync failed. Observations stay on this device.");
    }
    refresh();
  };

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then((d: Site[]) => {
        setSites(d);
        setSpringId(d[0]?.spring.id ?? 0);
      })
      .catch(() =>
        setMsg(
          "Spring list unavailable. Open this page online once to cache it.",
        ),
      );
    setOnline(navigator.onLine);
    refresh();
    const on = () => {
        setOnline(true);
        sync();
      },
      off = () => setOnline(false);
    addEventListener("online", on);
    addEventListener("offline", off);
    return () => {
      removeEventListener("online", on);
      removeEventListener("offline", off);
    };
  }, []); // eslint-disable-line

  const locate = () =>
    navigator.geolocation.getCurrentPosition(
      (p) => setPos([p.coords.latitude, p.coords.longitude]),
      () => setMsg("Location unavailable. Enable GPS or save without it."),
      { enableHighAccuracy: true },
    );

  const saveMap = async () => {
    const urls = tileUrls(sites);
    setTiles({ done: 0, total: urls.length });
    await saveArea(urls, (done) => setTiles({ done, total: urls.length }));
    setMsg(`Map area saved: ${urls.length} tiles available offline.`);
  };

  const save = async () => {
    if (!value.trim()) {
      setMsg("Enter a value or result first.");
      return;
    }
    await enqueue({
      clientId: crypto.randomUUID(),
      springId,
      kind,
      value: value.trim(),
      note,
      lat: pos?.[0] ?? null,
      lon: pos?.[1] ?? null,
      photo,
      observedAt: new Date().toISOString(),
    });
    setValue("");
    setNote("");
    setPhoto(null);
    setMsg("Saved on this device.");
    await refresh();
    if (navigator.onLine) sync();
  };

  return (
    <main className="page">
      <header className="app-header">
        <Brand compact showTagline />
        <h1>Field verification</h1>
        <nav className="nav">
          <a href="/">Map</a>
          <a href="/review">Review hub</a>
        </nav>
      </header>
      <div className={`status ${online ? "on" : "off"}`}>
        {online ? "Online" : "Offline"}: {queued} waiting to sync{" "}
        {queued > 0 && online && <button onClick={sync}>Sync now</button>}
      </div>
      <div className="minimap">
        <MapView
          sites={sites}
          selected={springId || null}
          onSelect={setSpringId}
          show={{ ws: true, rh: true }}
        />
      </div>
      <div className="form">
        <label>
          Spring
          <select
            value={springId}
            onChange={(e) => setSpringId(Number(e.target.value))}
          >
            {sites.map((s) => (
              <option key={s.spring.id} value={s.spring.id}>
                {s.spring.name} ({s.assessment.verdict})
              </option>
            ))}
          </select>
        </label>
        <label>
          Evidence type
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {KINDS.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label>
          Result
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. dye reached spring in 18 h"
          />
        </label>
        <label>
          Notes
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <label>
          Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setPhoto(await compress(f));
            }}
          />
        </label>
        {photo && (
          <img src={photo} alt="Attached observation" className="thumb" />
        )}
        <button className="ghost" onClick={locate}>
          {pos
            ? `GPS ${pos[0].toFixed(5)}, ${pos[1].toFixed(5)}`
            : "Capture GPS location"}
        </button>
        <button className="primary" onClick={save}>
          Save observation
        </button>
        <button
          className="ghost"
          onClick={saveMap}
          disabled={
            !sites.length || (tiles !== null && tiles.done < tiles.total)
          }
        >
          {tiles
            ? `Saving map area ${tiles.done}/${tiles.total}`
            : "Save map area for offline use (online only)"}
        </button>
        <p role="status">{msg}</p>
      </div>
    </main>
  );
}
