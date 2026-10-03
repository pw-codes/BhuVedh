-- CreateTable
CREATE TABLE "Spring" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "elevation" INTEGER NOT NULL,
    "lithology" TEXT NOT NULL,
    "dipDeg" REAL NOT NULL,
    "dipAzimuth" REAL NOT NULL,
    "aspect" REAL NOT NULL,
    "fractureDensity" REAL NOT NULL,
    "lineamentDistM" REAL NOT NULL,
    "dischargeLps" REAL NOT NULL,
    "declinePct" REAL NOT NULL,
    "evidenceCount" INTEGER NOT NULL,
    "slopeDeg" REAL NOT NULL,
    "landslideRisk" REAL NOT NULL,
    "tenure" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" TEXT NOT NULL,
    "springId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "photo" TEXT,
    "lat" REAL,
    "lon" REAL,
    "observedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewerNote" TEXT NOT NULL DEFAULT '',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    CONSTRAINT "Observation_springId_fkey" FOREIGN KEY ("springId") REFERENCES "Spring" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Observation_clientId_key" ON "Observation"("clientId");
