// Prefixes a /public path with the base path (e.g. "/Lustyones1" on GitHub Pages).
// Needed where Next can't add it itself, such as CSS url() in inline styles.
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
