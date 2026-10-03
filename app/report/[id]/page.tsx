import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { assess } from "@/lib/engine";
import { weightOf } from "@/lib/evidence";
import PrintButton from "@/components/PrintButton";
import Brand from "@/components/Brand";

export const dynamic = "force-dynamic";

const db = new PrismaClient();
const pct = (x: number) => Math.round(x * 100);

type ObservationSummary = {
  id: number;
  kind: string;
  value: string;
  observedAt: Date;
  reviewedBy: string | null;
};

type SpringDetailRow = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  lithology: string;
  dipDeg: number;
  dipAzimuth: number;
  aspect: number;
  fractureDensity: number;
  lineamentDistM: number;
  dischargeLps: number;
  declinePct: number;
  evidenceCount: number;
  slopeDeg: number;
  landslideRisk: number;
  tenure: string;
  observations: ObservationSummary[];
};

export default async function Report({ params }: { params: { id: string } }) {
  const row = (await db.spring.findUnique({
    where: { id: Number(params.id) },
    include: {
      observations: {
        where: { status: "accepted" },
        orderBy: { observedAt: "asc" },
      },
    },
  })) as SpringDetailRow | null;

  if (!row) notFound();
  const { observations: obs, ...spring } = row;
  const evidence =
    spring.evidenceCount +
    obs.reduce((total, observation) => total + weightOf(observation.kind), 0);
  const { assessment: a } = assess({ ...spring, evidenceCount: evidence });
  const kinds = new Set(obs.map((o) => o.kind));
  const next: string[] = [];
  if (!kinds.has("dye_trace") && !kinds.has("isotope"))
    next.push(
      "Run a dye trace or isotope sample from the proposed recharge zone to test the recharge link directly.",
    );
  if (a.divergence > 0.5)
    next.push(
      "Site structures on the up-dip recharge zone, not the surface watershed outlet.",
    );
  if (a.risk > 0.5)
    next.push(
      "Get a slope-stability and tenure check before any construction.",
    );
  if (a.verdict === "Prioritize")
    next.push(
      "Approve for design. Re-verify discharge after the first monsoon.",
    );
  if (!next.length)
    next.push("Collect more field evidence before committing funds.");
  const rows: [string, number][] = [
    ["Suitability", a.suitability],
    ["Need", a.need],
    ["Evidence confidence", a.confidence],
    ["Watershed / recharge divergence", a.divergence],
    ["Risk", a.risk],
    ["Priority", a.priority],
  ];

  return (
    <main className="report">
      <PrintButton />
      <div className="report-brand">
        <Brand compact variant="light" transparent />
      </div>
      <h1>{spring.name}: recharge site report</h1>
      <p>
        {spring.lat.toFixed(5)}, {spring.lon.toFixed(5)} · {spring.elevation} m
        · {spring.lithology}, dip {Math.round(spring.dipDeg)}° toward{" "}
        {Math.round(spring.dipAzimuth)}° · tenure: {spring.tenure}
      </p>
      <h2>Verdict: {a.verdict}</h2>
      <p>{a.guidance}</p>
      <table>
        <tbody>
          {rows.map(([l, v]) => (
            <tr key={l}>
              <th>{l}</th>
              <td>{pct(v)} / 100</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Why</h2>
      <ul>
        {a.drivers.length ? (
          a.drivers.map((d) => <li key={d}>{d}</li>)
        ) : (
          <li>No standout drivers.</li>
        )}
      </ul>
      <h2>Accepted field evidence</h2>
      {obs.length === 0 ? (
        <p>None yet. This assessment rests on baseline survey data only.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Result</th>
              <th>Reviewer</th>
            </tr>
          </thead>
          <tbody>
            {obs.map((o) => (
              <tr key={o.id}>
                <td>{o.observedAt.toLocaleDateString()}</td>
                <td>{o.kind.replace("_", " ")}</td>
                <td>{o.value}</td>
                <td>{o.reviewedBy ?? "n/a"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2>Recommended next steps</h2>
      <ul>
        {next.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <p className="fine">
        Generated {new Date().toLocaleDateString()} from BhuVedh. The recharge
        zone is a modelled hypothesis, not a confirmed flow path. Sample data.
      </p>
    </main>
  );
}
