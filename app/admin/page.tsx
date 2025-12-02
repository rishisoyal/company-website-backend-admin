export const dynamic = "force-dynamic";
export const revalidate = 0;

import AnalyticsCard from "@/components/AnalyticsCard";
import React from "react";
import { RealTimeData, GeneralStats, Metrics } from "@/types/analytics.types";
import BChart from "@/components/AnalyticsChart";
import AnalyticsTable from "@/components/AnalyticsTable";

export default async function Analytics() {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

  if (!BASE_API) {
    console.error("❌ ERROR: NEXT_PUBLIC_BASE_API is missing");
    return (
      <main className="p-8 text-red-500">
        Missing environment variable: NEXT_PUBLIC_BASE_API
      </main>
    );
  }

  // -----------------------------
  // 1. Parallel requests
  // -----------------------------
  const [
    realtimeRes,
    statsRes,
    osRes,
    deviceRes,
    browserRes,
  ] = await Promise.all([
    fetch(`${BASE_API}/api/analytics/realtime`, { cache: "no-store" }).catch(() => null),
    fetch(`${BASE_API}/api/analytics/stats`, { cache: "no-store" }).catch(() => null),
    fetch(`${BASE_API}/api/analytics/metrics?type=os`, { cache: "no-store" }).catch(() => null),
    fetch(`${BASE_API}/api/analytics/metrics?type=device`, { cache: "no-store" }).catch(() => null),
    fetch(`${BASE_API}/api/analytics/metrics?type=browser`, { cache: "no-store" }).catch(() => null),
  ]);

  // If any fetch failed return friendly error
  if (!realtimeRes || !statsRes || !osRes || !deviceRes || !browserRes) {
    console.error("❌ One or more API endpoints failed to respond");
    return <main className="p-8">API error. Check server logs.</main>;
  }

  // -----------------------------
  // 2. Parse JSON safely
  // -----------------------------
  const safeJson = async (res: Response, label: string) => {
    try {
      return await res.json();
    } catch (err) {
      console.error(`❌ JSON parse error in ${label}`, err);
      return null;
    }
  };

  const realtimeJSON = await safeJson(realtimeRes, "realtime");
  const statsJSON = await safeJson(statsRes, "stats");
  const osJSON = await safeJson(osRes, "os");
  const deviceJSON = await safeJson(deviceRes, "device");
  const browserJSON = await safeJson(browserRes, "browser");

  // -----------------------------
  // 3. Validate API structure
  // -----------------------------
  if (!realtimeJSON?.realTimeData) {
    console.error("❌ Invalid realtimeJSON:", realtimeJSON);
    return <main className="p-8">Failed to load real-time analytics.</main>;
  }

  if (!statsJSON?.generalStats) {
    console.error("❌ Invalid statsJSON:", statsJSON);
    return <main className="p-8">Failed to load stats.</main>;
  }

  const realTimeData: RealTimeData = realtimeJSON.realTimeData;
  const generalStats: GeneralStats = statsJSON.generalStats;

  const OSMetrics: Metrics[] = osJSON?.metrics ?? [];
  const deviceMetrics: Metrics[] = deviceJSON?.metrics ?? [];
  const browserMetrics: Metrics[] = browserJSON?.metrics ?? [];

  // -----------------------------
  // 4. Prepare table data
  // -----------------------------
  const pathVisitors = Object.entries(realTimeData?.urls ?? {}).map(
    ([path, val]) => ({
      Path: path,
      Visitors: val?.toString() ?? "0",
    })
  );

  const referrerVisitors = Object.entries(realTimeData?.referrers ?? {}).map(
    ([ref, val]) => ({
      Referrer: ref,
      Visitors: val?.toString() ?? "0",
    })
  );

  // -----------------------------
  // 5. Helpers
  // -----------------------------
  function msTimeFormat(ms: number) {
    return Math.floor(ms / 1000).toString();
  }

  // ----------------------------------------------------
  // SECURE RENDER — Now your UI can NEVER crash on Vercel
  // ----------------------------------------------------
  return (
    <main className="ml-12 lg:ml-64 flex flex-col items-center overflow-scroll min-h-screen justify-between">
      <div className="min-h-screen w-full flex flex-col items-center justify-between">
        <h2 className="text-[#181825] text-4xl text-left w-full pl-4 pt-4">
          Overview
        </h2>

        <div className="p-4 pt-0 flex gap-4 w-full">
          <AnalyticsCard title="Page view" data={generalStats.pageviews.toString()} />
          <AnalyticsCard title="Visitors" data={generalStats.visitors.toString()} />
          <AnalyticsCard title="Visits" data={generalStats.visits.toString()} />
          <AnalyticsCard title="Bounce rate" data={`${generalStats.bounces.toString()}%`} />
          <AnalyticsCard title="Total time" data={msTimeFormat(generalStats.totaltime)} />
        </div>

        <h2 className="text-[#181825] text-4xl text-left w-full pl-4 pt-4">
          Real Time
        </h2>

        <div className="p-4 pt-0 flex gap-4 w-full">
          <AnalyticsCard title="Views" data={realTimeData.totals.views.toString()} />
          <AnalyticsCard title="Visitors" data={realTimeData.totals.visitors.toString()} />
          <AnalyticsCard title="Events" data={realTimeData.totals.events.toString()} />
          <AnalyticsCard title="Countries" data={realTimeData.totals.countries.toString()} />
        </div>

        <div className="flex gap-4 w-full p-4 pt-0">
          <AnalyticsTable title="Pages" columns={["Path", "Visitors"]} data={pathVisitors} />
          <AnalyticsTable title="Refferrers" columns={["Referrer", "Visitors"]} data={referrerVisitors} />
        </div>
      </div>

      <div className="p-4 w-full flex items-center justify-end">
        <BChart
          xAxis={[{ label: "OS", data: OSMetrics.map((val) => val.x) }]}
          yAxis={[{ data: OSMetrics.map((val) => val.y) }]}
        />
      </div>

      <div className="p-4 w-full flex items-center justify-end">
        <BChart
          xAxis={[{ label: "Device", data: deviceMetrics.map((val) => val.x) }]}
          yAxis={[{ data: deviceMetrics.map((val) => val.y) }]}
        />
      </div>

      <div className="p-4 w-full flex items-center justify-end">
        <BChart
          xAxis={[{ label: "Browser", data: browserMetrics.map((val) => val.x) }]}
          yAxis={[{ data: browserMetrics.map((val) => val.y) }]}
        />
      </div>
    </main>
  );
}
