import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from "path";
import dotenv from "dotenv"

// Load environment variables from root .env
const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // You don't need to manually define `process.env`
  // Vite will expose all the variables with the `VITE_` prefix to `import.meta.env`
})
