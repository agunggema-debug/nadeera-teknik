import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
//
// Server-rendering (SSR) dipakai agar konten website (hero → footer) bisa
// dibaca langsung dari Supabase saat halaman diminta, sehingga perubahan
// dari dashboard admin langsung tampil di situs publik tanpa build ulang.
export default defineConfig({
  site: "https://nadeera-teknik.vercel.app/",
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
