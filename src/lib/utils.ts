import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** True if `path` is a same-app relative path, safe to redirect to. */
export function isValidRedirect(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//")
}
