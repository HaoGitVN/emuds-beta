// Cloudflare Worker: proxy CORS có allowlist, stream trực tiếp, không lưu file.
// Chỉ chuyển tiếp các URL bắt đầu bằng một tiền tố trong ALLOW.
const ALLOW = [
  // "https://archive.org/download/TEN-ITEM-CUA-BAN/",
  // "https://kho-cua-ban.example.com/roms/",
];
const MAX_BYTES = 128 * 1024 * 1024; // giới hạn 128 MB

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range",
  "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
  "Cross-Origin-Resource-Policy": "cross-origin",
};

export default {
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const target = new URL(req.url).searchParams.get("url") || "";
    if (!target || target.includes("..") || !ALLOW.some((p) => target.startsWith(p))) {
      return new Response("Nguồn không nằm trong danh sách cho phép", { status: 403, headers: CORS });
    }
    const headers = {};
    const range = req.headers.get("Range");
    if (range) headers.Range = range;
    const r = await fetch(target, { headers, redirect: "follow" });
    const len = Number(r.headers.get("Content-Length") || 0);
    if (len > MAX_BYTES) return new Response("File quá lớn", { status: 413, headers: CORS });
    const out = new Headers(CORS);
    for (const h of ["Content-Type", "Content-Length", "Content-Range", "Accept-Ranges"]) {
      if (r.headers.get(h)) out.set(h, r.headers.get(h));
    }
    out.set("Cache-Control", "public, max-age=86400");
    return new Response(r.body, { status: r.status, headers: out });
  },
};
