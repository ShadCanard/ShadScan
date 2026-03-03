export enum ScanType {
  UNKNOWN = "UNKNOWN",
  LETTER = "LETTER",
  PHOTO = "PHOTO",
  DRAWING = "DRAWING",
}

export const SCAN_TYPE_LABELS: Record<ScanType, string> = {
  [ScanType.UNKNOWN]: "Inconnu",
  [ScanType.LETTER]: "Lettre",
  [ScanType.PHOTO]: "Photo",
  [ScanType.DRAWING]: "Dessin",
};

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    scans: number;
  };
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scan {
  id: number;
  name: string;
  author: string;
  type: ScanType;
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  categoryId: number;
  category: Category;
  tags: Tag[];
  linkedScans: Scan[];
  receivedAt: string | number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedScans {
  scans: Scan[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ScanFilter {
  search?: string;
  type?: ScanType;
  categoryId?: number;
  tagIds?: number[];
  author?: string;
}

export interface Stats {
  totalScans: number;
  totalCategories: number;
  totalTags: number;
  scansByType: { type: ScanType; count: number }[];
}
