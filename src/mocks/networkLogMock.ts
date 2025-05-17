import type { NetworkLog } from "@/types";

// Sample network log objects
export const mockNetworkLogs: NetworkLog[] = [
  {
    ip: "192.168.1.105",
    timestamp: 1715961784000, // May 17, 2024, 10:23:04 AM
    request: {
      method: "GET",
      path: "/api/users",
      version: "HTTP/1.1",
    },
    status: 200,
    size: 1458,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  },
  {
    ip: "10.0.0.42",
    timestamp: 1715961845000, // May 17, 2024, 10:24:05 AM
    request: {
      method: "POST",
      path: "/api/auth/login",
      version: "HTTP/2.0",
    },
    status: 401,
    size: 287,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    ip: "172.16.254.1",
    timestamp: 1715961900000, // May 17, 2024, 10:25:00 AM
    request: {
      method: "PUT",
      path: "/api/products/12345",
      version: "HTTP/1.1",
    },
    status: 204,
    size: 0,
    userAgent: "PostmanRuntime/7.32.3",
  },
  {
    ip: "8.8.8.8",
    timestamp: 1715962020000, // May 17, 2024, 10:27:00 AM
    request: {
      method: "DELETE",
      path: "/api/comments/789",
      version: "HTTP/1.1",
    },
    status: 403,
    size: 156,
    userAgent: "curl/7.79.1",
  },
  {
    ip: "192.168.1.245",
    timestamp: 1715962140000, // May 17, 2024, 10:29:00 AM
    request: {
      method: "GET",
      path: "/images/banner.jpg",
      version: "HTTP/1.1",
    },
    status: 304,
    size: 0,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
  },
];
