export type NetworkLog = {
  ip: string;
  timestamp: number;
  request: {
    method: string;
    path: string;
    version: string;
  };
  status: number;
  size: number;
  userAgent: string;
};
