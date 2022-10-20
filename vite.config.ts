import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unocss({
      theme: {
        colors: {
          primary: '#161b3d',
          secondary: '#2821fc',
          element: '#f0f0f0',
        },
      },
      shortcuts: {
        'absolute-center': 'absolute top-50% left-50% translate-x--50% translate-y--50%',
        'fixed-center': 'fixed top-50% left-50% translate-x--50% translate-y--50%',
        'flex-center': 'flex justify-center items-center',
      },
    }),
  ],
})
