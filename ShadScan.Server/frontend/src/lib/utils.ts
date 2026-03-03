const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function getScanImageUrl(filePath: string): string {
  // filePath is stored as relative path like "uploads/uuid.jpg"
  const cleanPath = filePath.replace(/^\.\//, "");
  return `${API_URL}/${cleanPath}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(value?: string | number | null): string {
  if (value === undefined || value === null || value === "") return "";
  let d: Date;
  if (typeof value === "number") {
    d = new Date(value);
  } else {
    d = new Date(value);
  }
  if (isNaN(d.getTime())) {
    // if parsing failed just return original value so user sees something
    return String(value);
  }
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// same as formatDate but omit time portion (date only)
export function formatDateOnly(value?: string | number | null): string {
  if (value === undefined || value === null || value === "") return "";
  let d: Date;
  if (typeof value === "number") {
    d = new Date(value);
  } else {
    d = new Date(value);
  }
  if (isNaN(d.getTime())) {
    return String(value);
  }
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}