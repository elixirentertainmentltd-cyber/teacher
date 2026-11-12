import "server-only";

/**
 * Admin mutations must originate from the site that served the admin page.
 * On Hostinger, request.url can be an internal reverse-proxy URL, so do not
 * rely on it alone. Prefer the public Host header sent with the request.
 *
 * X-Forwarded-Host is deliberately ignored: it may be client-supplied.
 * TML_PUBLIC_ORIGIN remains supported for deployments that rewrite Host.
 */
const legacyOrigins = new Set(["https://teach.weareelixir.co.uk"]);

function configuredOrigin(): string | null {
  const value = process.env.TML_PUBLIC_ORIGIN;
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (parsed.username || parsed.password) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

export function validAdminOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  // Browsers send Origin for JSON POST/DELETE requests. Non-browser callers
  // still require a valid authenticated admin session at each route.
  if (!origin) return true;

  try {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || !["https:", "http:"].includes(parsed.protocol)) return false;
    if (parsed.username || parsed.password || origin === "null") return false;

    const configured = configuredOrigin();
    if (legacyOrigins.has(origin) || origin === configured) return true;
    if (origin === new URL(request.url).origin) return true;

    // Host is the authority for the incoming public request even when
    // request.url points at Hostinger's internal Next.js destination.
    const host = request.headers.get("host");
    if (!host || /[\s/@\\]/.test(host)) return false;
    const incoming = new URL(`${parsed.protocol}//${host}`);
    return incoming.host === parsed.host && incoming.hostname === parsed.hostname;
  } catch {
    return false;
  }
}
