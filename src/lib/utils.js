import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseDateLocal(value) {
  if (value == null) return new Date(NaN)
  const s = typeof value === 'string' ? value.trim() : String(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T12:00:00')
  return new Date(value)
}
