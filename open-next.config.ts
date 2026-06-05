import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  cloudflare: {
    // Disable the `workerd` esbuild condition.
    // With it ON, esbuild tries to resolve `workerd`-specific sub-paths
    // (e.g. @libsql/isomorphic-ws ./web.mjs) that don't exist on disk
    // in the installed package, causing "Could not resolve" errors.
    // Our db/index.ts already uses the explicit /web imports so this is safe.
    useWorkerdCondition: false,
  },
});
