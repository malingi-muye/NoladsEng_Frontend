import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Unified Vite config for SPA + optional API proxying
// - Dev: If VITE_API_PROXY_URL is set, proxy /api to that target (e.g., PHP API)
//        Otherwise, mount the local Express app for API endpoints
// - Build: Outputs SPA to dist/spa for cPanel/static hosting
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_API_PROXY_URL || "";

  const useProxy = Boolean(proxyTarget);

  return {
    server: {
      host: "::",
      port: 8080,
      ...(useProxy
        ? {
            proxy: {
              "/api": {
                target: proxyTarget,
                changeOrigin: true,
                secure: false,
              },
            },
          }
        : {}),
    },
    build: {
      outDir: "dist",
    },
  plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };
});
