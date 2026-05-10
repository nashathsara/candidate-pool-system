import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
})
=======
  css: {
    postcss: './postcss.config.cjs',  // Add this line to point to your PostCSS config
  },
})
>>>>>>> 4d0d5e9cf670627f264b33f3be0a82fea11ad518
