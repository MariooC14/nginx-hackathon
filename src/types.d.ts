export type NetworkLog = {
  id: number;
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
  isAnomaly: boolean;
  note?: string;
  isAnomaly?: boolean;
};
