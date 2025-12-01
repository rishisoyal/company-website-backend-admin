import AnalyticsCard from "@/components/AnalyticsCard";
import React from "react";
import axios from "axios";
import { RealTimeData, GeneralStats, Metrics } from "@/types/analytics.types";
import BChart from "@/components/AnalyticsChart";
import AnalyticsTable from "@/components/AnalyticsTable";

export default async function Analytics() {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  let res = await axios.get(`${BASE_API}/api/analytics/realtime`);
  const realTimeData: RealTimeData = res.data.realTimeData;
  const pathVisitors: { Path: string; Visitors: string }[] = [];
  for (const path in realTimeData.urls) {
    pathVisitors.push({
      Path: path,
      Visitors: realTimeData.urls[path].toString(),
    });
  }
  const referrerVisitors: { Referrer: string; Visitors: string }[] = [];
  for (const referrer in realTimeData.referrers) {
    referrerVisitors.push({
      Referrer: referrer,
      Visitors: realTimeData.referrers[referrer].toString(),
    });
  }
  res = await axios.get(`${BASE_API}/api/analytics/stats`);
  const generalStats: GeneralStats = res.data.generalStats;

  res = await axios.get(`${BASE_API}/api/analytics/metrics?type=os`);
  const OSMetrics: Metrics[] = res.data.metrics;
  res = await axios.get(`${BASE_API}/api/analytics/metrics?type=device`);
  const deviceMetrics: Metrics[] = res.data.metrics;
  res = await axios.get(`${BASE_API}/api/analytics/metrics?type=browser`);
  const browserMetrics: Metrics[] = res.data.metrics;

  function msTimeFormat(ms: number) {
    let s = Math.floor(ms / 1000);

    return `${s}`;
  }

  return (
    <>
      <main className="ml-12 lg:ml-64 flex flex-col items-center overflow-scroll min-h-screen justify-between">
        <div className="min-h-screen w-full flex flex-col items-center justify-between">
          <h2 className="text-[#181825] text-4xl text-left w-full pl-4 pt-4">
            Overview
          </h2>
          <div className="p-4 pt-0 flex gap-4 w-full">
            <AnalyticsCard
              title="Page view"
              data={generalStats.pageviews.toString()}
            />
            <AnalyticsCard
              title="Visitors"
              data={generalStats.visitors.toString()}
            />
            <AnalyticsCard
              title="Visits"
              data={generalStats.visits.toString()}
            />
            <AnalyticsCard
              title="Bounce rate"
              data={`${generalStats.bounces.toString()}%`}
            />
            <AnalyticsCard
              title="Total time"
              data={msTimeFormat(generalStats.totaltime)}
            />
          </div>
          <h2 className="text-[#181825] text-4xl text-left w-full pl-4 pt-4">
            Real Time
          </h2>
          <div className="p-4 pt-0 flex gap-4 w-full">
            <AnalyticsCard
              title="Views"
              data={realTimeData.totals.views.toString()}
            />
            <AnalyticsCard
              title="Visitors"
              data={realTimeData.totals.visitors.toString()}
            />
            <AnalyticsCard
              title="Events"
              data={realTimeData.totals.events.toString()}
            />
            <AnalyticsCard
              title="Countries"
              data={realTimeData.totals.countries.toString()}
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

        <div className="p-4 w-full flex items-center justify-end">
          <BChart
            xAxis={[{ label: "OS", data: OSMetrics.map((val) => val.x) }]}
            yAxis={[{ data: OSMetrics.map((val) => val.y) }]}
          />
        </div>
        <div className="p-4 w-full flex items-center justify-end">
          <BChart
            xAxis={[
              { label: "Device", data: deviceMetrics.map((val) => val.x) },
            ]}
            yAxis={[{ data: deviceMetrics.map((val) => val.y) }]}
          />
        </div>
        <div className="p-4 w-full flex items-center justify-end">
          <BChart
            xAxis={[
              { label: "Browser", data: browserMetrics.map((val) => val.x) },
            ]}
            yAxis={[{ data: browserMetrics.map((val) => val.y) }]}
          />
        </div>
      </main>
    </>
  );
}
