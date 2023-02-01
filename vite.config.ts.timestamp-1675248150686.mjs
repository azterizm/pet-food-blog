// vite.config.ts
import { defineConfig } from "file:///home/abdiel/Code/pet-food/client/node_modules/vite/dist/node/index.js";
import react from "file:///home/abdiel/Code/pet-food/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import Unocss from "file:///home/abdiel/Code/pet-food/client/node_modules/unocss/dist/vite.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    Unocss({
      theme: {
        colors: {
          primary: "#161b3d",
          secondary: "#2821fc",
          element: "#f0f0f0"
        }
      },
      shortcuts: {
        "absolute-center": "absolute top-50% left-50% translate-x--50% translate-y--50%",
        "fixed-center": "fixed top-50% left-50% translate-x--50% translate-y--50%",
        "flex-center": "flex justify-center items-center",
        "large-input": "focus:border-primary focus:outline-none mt-10 mb-5 p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element w-60% text-center",
        "fill-btn": "bg-primary px-5 py-3 rounded-lg c-white font-bold mt-2",
        "white-btn": "bg-transparent hover:underline cursor-pointer c-primary text-lg border-none"
      }
    })
  ],
  server: { port: 5002 },
  build: { assetsDir: "client_assets", minify: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hYmRpZWwvQ29kZS9wZXQtZm9vZC9jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2FiZGllbC9Db2RlL3BldC1mb29kL2NsaWVudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hYmRpZWwvQ29kZS9wZXQtZm9vZC9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFVub2Nzcyh7XG4gICAgICB0aGVtZToge1xuICAgICAgICBjb2xvcnM6IHtcbiAgICAgICAgICBwcmltYXJ5OiAnIzE2MWIzZCcsXG4gICAgICAgICAgc2Vjb25kYXJ5OiAnIzI4MjFmYycsXG4gICAgICAgICAgZWxlbWVudDogJyNmMGYwZjAnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNob3J0Y3V0czoge1xuICAgICAgICAnYWJzb2x1dGUtY2VudGVyJzpcbiAgICAgICAgICAnYWJzb2x1dGUgdG9wLTUwJSBsZWZ0LTUwJSB0cmFuc2xhdGUteC0tNTAlIHRyYW5zbGF0ZS15LS01MCUnLFxuICAgICAgICAnZml4ZWQtY2VudGVyJzpcbiAgICAgICAgICAnZml4ZWQgdG9wLTUwJSBsZWZ0LTUwJSB0cmFuc2xhdGUteC0tNTAlIHRyYW5zbGF0ZS15LS01MCUnLFxuICAgICAgICAnZmxleC1jZW50ZXInOiAnZmxleCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXInLFxuICAgICAgICAnbGFyZ2UtaW5wdXQnOlxuICAgICAgICAgICdmb2N1czpib3JkZXItcHJpbWFyeSBmb2N1czpvdXRsaW5lLW5vbmUgbXQtMTAgbWItNSBwLTUgcGItMyBmb250LWJsYWNrIGMtcHJpbWFyeSB0ZXh0LXhsIGJvcmRlci10LTAgYm9yZGVyLWwtMCBib3JkZXItci0wIGJvcmRlci1iLTQgYm9yZGVyLWVsZW1lbnQgdy02MCUgdGV4dC1jZW50ZXInLFxuICAgICAgICAnZmlsbC1idG4nOiAnYmctcHJpbWFyeSBweC01IHB5LTMgcm91bmRlZC1sZyBjLXdoaXRlIGZvbnQtYm9sZCBtdC0yJyxcbiAgICAgICAgJ3doaXRlLWJ0bic6XG4gICAgICAgICAgJ2JnLXRyYW5zcGFyZW50IGhvdmVyOnVuZGVybGluZSBjdXJzb3ItcG9pbnRlciBjLXByaW1hcnkgdGV4dC1sZyBib3JkZXItbm9uZScsXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBzZXJ2ZXI6IHsgcG9ydDogNTAwMiB9LFxuICBidWlsZDogeyBhc3NldHNEaXI6ICdjbGllbnRfYXNzZXRzJywgbWluaWZ5OiB0cnVlIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUixTQUFTLG9CQUFvQjtBQUNsVCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBR25CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFNBQVM7QUFBQSxVQUNULFdBQVc7QUFBQSxVQUNYLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsbUJBQ0U7QUFBQSxRQUNGLGdCQUNFO0FBQUEsUUFDRixlQUFlO0FBQUEsUUFDZixlQUNFO0FBQUEsUUFDRixZQUFZO0FBQUEsUUFDWixhQUNFO0FBQUEsTUFDSjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVEsRUFBRSxNQUFNLEtBQUs7QUFBQSxFQUNyQixPQUFPLEVBQUUsV0FBVyxpQkFBaUIsUUFBUSxLQUFLO0FBQ3BELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
