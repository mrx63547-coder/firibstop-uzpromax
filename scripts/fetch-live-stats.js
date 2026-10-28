
const fs = require("node:fs");
const path = require("node:path");

const outputPath = path.join(
  process.cwd(),
  "data",
  "live-stats.json"
);

async function main() {
  const url =
    "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    throw new Error(`CISA returned HTTP ${response.status}`);
  }

  const json = await response.json();

  if (!Array.isArray(json.vulnerabilities)) {
    throw new Error("Invalid CISA response: vulnerabilities missing");
  }

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);

  const daily = new Map();

  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setUTCDate(day.getUTCDate() - i);
    daily.set(day.toISOString().slice(0, 10), 0);
  }

  for (const item of json.vulnerabilities) {
    const date = item.dateAdded;
    if (!date || date < cutoff.toISOString().slice(0, 10)) continue;

    if (daily.has(date)) {
      daily.set(date, daily.get(date) + 1);
    }
  }

  const result = {
    source: "CISA KEV",
    sourceUrl: url,
    metric: "Vulnerabilities added to the catalog per day",
    updatedAt: now.toISOString(),
    totalCatalogEntries: json.vulnerabilities.length,
    last30Days: Array.from(daily, ([date, count]) => ({
      date,
      count
    }))
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + "\n");

  console.log(
    `Saved ${result.last30Days.length} daily points from CISA.`
  );
}

main().catch((error) => {
  console.error("Live stats update failed:", error);
  process.exitCode = 1;
});
