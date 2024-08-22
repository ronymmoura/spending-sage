import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import Unfonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    Unfonts({
      google: {
        families: [
          {
            name: "Sen",
            styles: "wght@100;200;300;400;500;600;700;800;900",
            defer: true,
          },
          {
            name: "Montserrat",
            styles: "wght@100;200;300;400;500;600;700;800;900",
            defer: true,
          },
        ],
      },
    }),
  ],
});
