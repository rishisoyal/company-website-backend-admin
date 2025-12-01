/**
 * Interface for a single point in the time series charts (views or visitors).
 */
export interface TimeSeriesPoint {
  /** The timestamp for the data point (ISO 8601 format). */
  x: string;
  /** The count value for the given time point. */
  y: number;
}

/**
 * Interface for a single real-time event, such as a pageview or session start.
 */
export interface RealTimeEvent {
  /** The type of the event, either 'pageview' or 'session'. */
  __type: "pageview" | "session";
  /** A unique identifier for the user session. */
  sessionId: string;
  /** The specific name of the event (can be an empty string for pageviews/sessions). */
  eventName: string;
  /** The time the event was created (ISO 8601 format). */
  createdAt: string;
  /** The browser used by the visitor (e.g., 'firefox'). */
  browser: string;
  /** The operating system of the visitor (e.g., 'Windows 10'). */
  os: string;
  /** The device type of the visitor (e.g., 'laptop'). */
  device: string;
  /** The country code of the visitor (e.g., 'IN'). */
  country: string;
  /** The URL path visited (e.g., '/contact'). */
  urlPath: string;
  /** The domain that referred the visitor. */
  referrerDomain: string;
}

/**
 * Interface for the time series data (views and visitors over time).
 */
export interface RealTimeSeries {
  /** Time series data for page views. */
  views: TimeSeriesPoint[];
  /** Time series data for unique visitors. */
  visitors: TimeSeriesPoint[];
}

/**
 * Interface for the aggregated totals of the real-time data.
 */
export interface RealTimeTotals {
  /** Total number of page views. */
  views: number;
  /** Total number of unique visitors. */
  visitors: number;
  /** Total number of custom events (0 in the sample data). */
  events: number;
  /** Total number of distinct countries recorded. */
  countries: number;
}

/**
 * Interface for the main real-time analytics data object.
 */
export interface RealTimeData {
  /** A map of country codes to the number of visitors from that country. */
  countries: Record<string, number>;
  /** A map of URL paths to the number of times they were visited. */
  urls: Record<string, number>;
  /** A map of referrer domains to the number of visits from them. */
  referrers: Record<string, number>;
  /** A list of recent events (pageviews and sessions). */
  events: RealTimeEvent[];
  /** Time series data for visualization. */
  series: RealTimeSeries;
  /** Aggregated totals for the current real-time window. */
  totals: RealTimeTotals;
  /** The Unix timestamp (in milliseconds) when the data was generated. */
  timestamp: number;
}

/**
 * The top-level interface representing the full API response.
 */
export interface RealTimeAnalyticsResponse {
  realTimeData: RealTimeData;
}

export interface GeneralStats {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  comparison: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
  };
}

export type Metrics = {
  /**
   * metric type (os, device, browser, etc)
   */
  x: string;
  y: number;
};
