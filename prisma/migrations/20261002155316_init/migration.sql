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
