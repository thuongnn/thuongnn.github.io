import { SERIES, type Series } from "@/constants";
export type { Series };

// Helper function để lấy series từ folder
export function getSeriesFromFolder(folder: string): Series | undefined {
  return SERIES.find(series => series.folder === folder);
}

// Helper function để lấy tất cả series
export function getAllSeries(): Series[] {
  return SERIES;
}
