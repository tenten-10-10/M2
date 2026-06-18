// Minimal resolve hook so Node can run the app's TS modules, which use
// extensionless relative imports (resolved by the bundler in production).
import { extname } from "node:path";

export async function resolve(specifier, context, nextResolve) {
  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !extname(specifier)
  ) {
    try {
      return await nextResolve(specifier + ".ts", context);
    } catch {
      // fall through to default resolution
    }
  }
  return nextResolve(specifier, context);
}
