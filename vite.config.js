import { defineConfig } from 'vite'
import pugPlugin from 'vite-plugin-pug';
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

const options = { pretty: true } // FIXME: pug pretty is deprecated!
const locals = { name: "My Pug" }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),pugPlugin(options, locals)],
})
