"use client";
import { useEffect, useState } from "react";
import { weightOf } from "@/lib/evidence";
import Brand from "@/components/Brand";

type Obs = {
  id: number;
  kind: string;
  value: string;
  note: string;
  reviewerNote: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  photo: string | null;
  observedAt: string;
  lat: number | null;
  lon: number | null;
  spring: { name: string };
};
const TABS = ["pending", "accepted", "rejected"] as const;

export default function Review() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending");
  const [items, setItems] = useState<Obs[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const load = () =>
    fetch(`/api/observations?status=${tab}`)
      .then((r) => {
        if (r.status === 401) {
          location.href = "/login";
          return [];
        }
        return r.json();
      })
      .then(setItems);
  useEffect(() => {
    load();
  }, [tab]); // eslint-disable-line
  const decide = async (id: number, status: "accepted" | "rejected") => {
    await fetch(`/api/observations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewerNote: notes[id] ?? "" }),
    });
    load();
  };
  return (
    <main className="page wide">
      <header className="app-header">
        <Brand compact showTagline />
        <h1>Review hub</h1>
        <nav className="nav">
          <a href="/">Map</a>
          <a href="/field">Field verification</a>
        </nav>
      </header>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <p className="lead">
        Each accepted observation adds to the spring's evidence score. A dye
        trace counts most; field readings count less.
      </p>
      {items.length === 0 && <p className="lead">Nothing here yet.</p>}
      {items.map((o) => (
        <article key={o.id} className="obs">
          <h2>{o.spring.name}</h2>
          <p>
            <b>{o.kind.replace("_", " ")}:</b> {o.value}{" "}
            <small>(adds {weightOf(o.kind)} if accepted)</small>
          </p>
          {o.note && <p>{o.note}</p>}
          {o.photo && (
            <img
              src={o.photo}
              alt={`Field photo at ${o.spring.name}`}
              className="thumb"
            />
          )}
          <small>
            {new Date(o.observedAt).toLocaleString()}{" "}
            {o.lat !== null
              ? `· ${o.lat.toFixed(4)}, ${o.lon!.toFixed(4)}`
              : "· no GPS fix"}
          </small>
          {tab === "pending" ? (
            <>
              <input
                placeholder="Reviewer note (optional)"
                value={notes[o.id] ?? ""}
                onChange={(e) => setNotes({ ...notes, [o.id]: e.target.value })}
              />
              <div className="actions">
                <button
                  className="primary"
                  onClick={() => decide(o.id, "accepted")}
                >
                  Accept evidence
                </button>
                <button
                  className="ghost"
                  onClick={() => decide(o.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </>
          ) : (
            <div className="note">
              {o.reviewerNote || "No reviewer note."}{" "}
              <small>
                ({o.reviewedBy ?? "unknown"},{" "}
                {o.reviewedAt ? new Date(o.reviewedAt).toLocaleString() : ""})
              </small>
            </div>
          )}
        </article>
      ))}
    </main>
  );
}
