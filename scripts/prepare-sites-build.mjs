import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, ".sites-public");
const entries = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "favicon.svg",
  "css",
  "js",
  "assets/img-project",
  "assets/championships-web",
  "assets/speaker-web",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(resolve(output, "assets"), { recursive: true });

for (const entry of entries) {
  await cp(resolve(root, entry), resolve(output, entry), { recursive: true });
}

await cp(resolve(root, "assets", "og.png"), resolve(output, "assets", "og.png"));
await cp(resolve(root, "assets", "og-v2.png"), resolve(output, "assets", "og-v2.png"));
