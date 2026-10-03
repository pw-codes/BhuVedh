import { PrismaClient } from "@prisma/client";
import { assess } from "@/lib/engine";
import { weightOf } from "@/lib/evidence";

export const dynamic = "force-dynamic";

const db = new PrismaClient();

type SpringWithAcceptedObservations = {
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
  observations: { kind: string }[];
};

const evidenceScore = (
  spring: Pick<
    SpringWithAcceptedObservations,
    "evidenceCount" | "observations"
  >,
) =>
  Number(
    (
      spring.evidenceCount +
      spring.observations.reduce(
        (total, observation) => total + weightOf(observation.kind),
        0,
      )
    ).toFixed(2),
  );

export async function GET() {
  const rows = (await db.spring.findMany({
    include: {
      observations: { where: { status: "accepted" }, select: { kind: true } },
    },
  })) as SpringWithAcceptedObservations[];

  const sites = rows
    .map((spring) => {
      const evidence = evidenceScore(spring);
      const a = assess({ ...spring, evidenceCount: evidence });
      const { observations, ...springData } = spring;
      return { spring: { ...springData, evidenceCount: evidence }, ...a };
    })
    .sort((x, y) => y.assessment.priority - x.assessment.priority);

  return Response.json(sites);
}
