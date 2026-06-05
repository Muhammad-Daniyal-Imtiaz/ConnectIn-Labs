import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Tell the OpenNext esbuild bundler to leave @libsql imports untouched.
  // The workerd runtime resolves them natively via the nodejs_compat flag.
  overrides: {
    wrapper: "cloudflare-node",
  },
});
