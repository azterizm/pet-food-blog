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
        'absolute-center':
          'absolute top-50% left-50% translate-x--50% translate-y--50%',
        'fixed-center':
          'fixed top-50% left-50% translate-x--50% translate-y--50%',
        'flex-center': 'flex justify-center items-center',
        'large-input':
          'focus:border-primary focus:outline-none mt-10 mb-5 p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element w-60% text-center',
        'fill-btn': 'bg-primary px-5 py-3 rounded-lg c-white font-bold mt-2',
        'white-btn':
          'bg-transparent hover:underline cursor-pointer c-primary text-lg border-none',
      },
    }),
  ],
  server: { port: 5002 },
  build: { assetsDir: 'client_assets', minify: true },
})
