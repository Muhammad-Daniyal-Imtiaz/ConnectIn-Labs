import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  cloudflare: {
    // Disable workerd condition to avoid @libsql/isomorphic-ws resolution issues
    // The workerd condition points to a non-existent web.mjs file in isomorphic-ws
    useWorkerdCondition: false,
  },
});
