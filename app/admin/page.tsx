"use client";

import {
  AnalyticsBChart,
  AnalyticsCard,
  AnalyticsTable,
} from "@/components/Analytics";
import { fetchWithProgress } from "@/lib/fetchWithProgress";
import { GeneralStats, Metrics, RealTimeData } from "@/types/analytics.types";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

export default function Analytics() {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [data, setData] = useState<{
    realTimeData: RealTimeData;
    generalStats: GeneralStats;
    OSMetrics: Metrics[];
    deviceMetrics: Metrics[];
    browserMetrics: Metrics[];
  } | null>(null);

  if (!BASE_API) {
    console.error("❌ ERROR: NEXT_PUBLIC_BASE_API is missing");
    return (
      <main className="p-8 text-red-500">
        Missing environment variable: NEXT_PUBLIC_BASE_API
      </main>
    );
  }

  useEffect(() => {
    async function fetchData() {
      // -----------------------------
      // 1. Parallel requests
      // -----------------------------
      const [realtimeRes, statsRes, osRes, deviceRes, browserRes] =
        await Promise.all([
          fetchWithProgress(`${BASE_API}/api/analytics/realtime`, {
            cache: "no-store",
          }).catch(() => null),
          fetchWithProgress(`${BASE_API}/api/analytics/stats`, {
            cache: "no-store",
          }).catch(() => null),
          fetchWithProgress(`${BASE_API}/api/analytics/metrics?type=os`, {
            cache: "no-store",
          }).catch(() => null),
          fetchWithProgress(`${BASE_API}/api/analytics/metrics?type=device`, {
            cache: "no-store",
          }).catch(() => null),
          fetchWithProgress(`${BASE_API}/api/analytics/metrics?type=browser`, {
            cache: "no-store",
          }).catch(() => null),
        ]);

      // If any fetch failed return friendly error
      if (!realtimeRes || !statsRes || !osRes || !deviceRes || !browserRes) {
        console.error("❌ One or more API endpoints failed to respond");
        return (
          <main className="p-8 text-black">API error. Check server logs.</main>
        );
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

      setData({
        realTimeData: realtimeJSON.realTimeData,
        generalStats: statsJSON.generalStats,
        OSMetrics: osJSON?.metrics ?? [],
        deviceMetrics: deviceJSON?.metrics ?? [],
        browserMetrics: browserJSON?.metrics ?? [],
      });
    }

    fetchData();
  }, []);

  if (!data) {
    return (
      <>
        <div className="flex text-black text-4xl items-center justify-center h-screen w-full ml-30">
          {/* Loading... */}
          <TailSpin />
        </div>
      </>
    );
  }

  // -----------------------------
  // 4. Prepare table data
  // -----------------------------
  const pathVisitors = Object.entries(data.realTimeData?.urls ?? {}).map(
    ([path, val]) => ({
      Path: path,
      Visitors: val?.toString() ?? "0",
    })
  );

  const referrerVisitors = Object.entries(
    data.realTimeData?.referrers ?? {}
  ).map(([ref, val]) => ({
    Referrer: ref,
    Visitors: val?.toString() ?? "0",
  }));

  // -----------------------------
  // 5. Helpers
  // -----------------------------
  function msTimeFormat(ms: number) {
    return Math.floor(ms / 1000).toString();
  }

  return (
    <main className="ml-12 lg:ml-64 flex flex-col items-center overflow-scroll min-h-screen justify-between animate__animated animate__fadeIn">
      <div className="w-full flex flex-col items-center justify-evenly h-screen">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-[#181825] text-4xl text-left w-full pl-4 pt-4">
            Overview
          </h2>
          <div className="p-4 pt-0 flex gap-4 w-full">
            <AnalyticsCard
              title="Page view"
              data={data.generalStats.pageviews.toString()}
            />
            <AnalyticsCard
              title="Visitors"
              data={data.generalStats.visitors.toString()}
            />
            <AnalyticsCard
              title="Visits"
              data={data.generalStats.visits.toString()}
            />
            <AnalyticsCard
              title="Bounce rate"
              data={`${data.generalStats.bounces.toString()}%`}
            />
            <AnalyticsCard
              title="Total time"
              data={msTimeFormat(data.generalStats.totaltime)}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-[#181825] text-4xl text-left w-full pl-4 pt-4">
            Real Time
          </h2>
          <div className="p-4 pt-0 flex gap-4 w-full">
            <AnalyticsCard
              title="Views"
              data={data.realTimeData.totals.views.toString()}
            />
            <AnalyticsCard
              title="Visitors"
              data={data.realTimeData.totals.visitors.toString()}
            />
            <AnalyticsCard
              title="Events"
              data={data.realTimeData.totals.events.toString()}
            />
            <AnalyticsCard
              title="Countries"
              data={data.realTimeData.totals.countries.toString()}
            />
          </div>
          <div className="flex gap-4 w-full p-4 pt-0">
            <AnalyticsTable
              title="Pages"
              columns={["Path", "Visitors"]}
              data={pathVisitors}
            />
            <AnalyticsTable
              title="Refferrers"
              columns={["Referrer", "Visitors"]}
              data={referrerVisitors}
            />
          </div>
        </div>
      </div>

      <div className="p-4 w-full flex items-center justify-end">
        <AnalyticsBChart
          xAxis={[{ label: "OS", data: data.OSMetrics.map((val) => val.x) }]}
          yAxis={[{ data: data.OSMetrics.map((val) => val.y) }]}
        />
      </div>

      <div className="p-4 w-full flex items-center justify-end">
        <AnalyticsBChart
          xAxis={[
            { label: "Device", data: data.deviceMetrics.map((val) => val.x) },
          ]}
          yAxis={[{ data: data.deviceMetrics.map((val) => val.y) }]}
        />
      </div>

      <div className="p-4 w-full flex items-center justify-end">
        <AnalyticsBChart
          xAxis={[
            { label: "Browser", data: data.browserMetrics.map((val) => val.x) },
          ]}
          yAxis={[{ data: data.browserMetrics.map((val) => val.y) }]}
        />
      </div>
    </main>
  );
}
