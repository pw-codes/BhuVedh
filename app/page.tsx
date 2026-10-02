"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Assessment, SpringRow } from "@/lib/engine";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export type Site = { spring: SpringRow; assessment: Assessment; watershed: number[][][]; recharge: number[][][] };
const pct = (x: number) => Math.round(x * 100);

function Bar({ label, v, risk }: { label: string; v: number; risk?: boolean }) {
  return <div className={`bar ${risk ? "risk" : ""}`}><span>{label}</span><i><span style={{ width: `${pct(v)}%` }} /></i><span>{pct(v)}</span></div>;
}

export default function Page() {
  const [sites, setSites] = useState<Site[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [show, setShow] = useState({ ws: true, rh: true });
  const [err, setErr] = useState("");
  useEffect(() => { fetch("/api/sites").then((r) => r.json()).then(setSites).catch(() => setErr("Could not load springs. Run npm run db:setup, then reload.")); }, []);
  const cur = sites.find((s) => s.spring.id === sel);

  return (
    <div className="app">
      <aside>
        <header><h1>BhuVedh</h1><p>Spring recharge planning, Kumaon Himalaya (sample data)</p><nav className="nav"><a href="/field">Field verification</a><a href="/review">Review hub</a></nav></header>
        <div className="layers">
          <label><input type="checkbox" checked={show.ws} onChange={(e) => setShow({ ...show, ws: e.target.checked })} />Surface watershed</label>
          <label><input type="checkbox" checked={show.rh} onChange={(e) => setShow({ ...show, rh: e.target.checked })} />Recharge hypothesis</label>
        </div>
        {err && <p style={{ padding: 18 }}>{err}</p>}
        <div>{sites.map((s) => (
          <button key={s.spring.id} className="row" aria-current={s.spring.id === sel} onClick={() => setSel(s.spring.id)}>
            <span className={`pill ${s.assessment.verdict.split(" ")[0]}`}>{s.assessment.verdict}</span>
            <b>{s.spring.name}</b>
            <small>Priority {pct(s.assessment.priority)} · Confidence {pct(s.assessment.confidence)}</small>
          </button>))}</div>
        {cur && (
          <section className="detail">
            <h2>{cur.spring.name}</h2>
            <small>{cur.spring.lithology}, dip {Math.round(cur.spring.dipDeg)}° toward {Math.round(cur.spring.dipAzimuth)}°, {cur.spring.elevation} m</small>
            <Bar label="Suitability" v={cur.assessment.suitability} />
            <Bar label="Need" v={cur.assessment.need} />
            <Bar label="Evidence" v={cur.assessment.confidence} />
            <Bar label="Divergence" v={cur.assessment.divergence} />
            <Bar label="Risk" v={cur.assessment.risk} risk />
            <ul>{cur.assessment.drivers.map((d) => <li key={d}>{d}</li>)}</ul>
            <div className="note">{cur.assessment.guidance}</div>
            <p><a href={`/report/${cur.spring.id}`}>Open site report</a></p>
          </section>)}
      </aside>
      <MapView sites={sites} selected={sel} onSelect={setSel} show={show} />
    </div>
  );
}
