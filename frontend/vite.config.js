import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     host: "0.0.0.0",
//     port: 5173,
//     proxy: {
//       "/api": {
//         target: "http://hotel-backend:3001",
//         changeOrigin: true,
//       },
//     },
//   },
//   plugins: [react()],
// });



export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Local backend URL
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
