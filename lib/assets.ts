/** Public path prefix. Empty in local dev; `/dwb-redesign` on the GitHub Pages preview. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
