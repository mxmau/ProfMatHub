import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/nvidia': {
            target: 'https://integrate.api.nvidia.com/v1',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/nvidia/, ''),
          }
        }
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          devOptions: {
            enabled: true, // Enables PWA in dev server for testing
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            navigateFallback: '/index.html',
            navigateFallbackDenylist: [
              /^\/GERADOR/, 
              /^\/GRADE/
            ],
          },
          manifest: {
            name: 'ProfMat Hub',
            short_name: 'ProfMat',
            description: 'Ferramentas do Professor de Matemática (Notas de Aula, Gerador de Provas e Grade)',
            theme_color: '#0f172a', // Slate 900
            background_color: '#0f172a',
            display: 'standalone',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ],
      define: {
        // loadEnv reads .env files (local dev).
        // process.env reads Netlify UI env vars (production build).
        // We need BOTH: env file wins for local, process.env wins on Netlify.
        'process.env.API_KEY':            JSON.stringify(env.GEMINI_API_KEY       || process.env.GEMINI_API_KEY       || ''),
        'process.env.GEMINI_API_KEY':     JSON.stringify(env.GEMINI_API_KEY       || process.env.GEMINI_API_KEY       || ''),
        'process.env.GROQ_API_KEY':       JSON.stringify(env.GROQ_API_KEY         || process.env.GROQ_API_KEY         || ''),
        'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY   || process.env.OPENROUTER_API_KEY   || ''),
        'process.env.OPENROUTER_MODEL':   JSON.stringify(env.OPENROUTER_MODEL     || process.env.OPENROUTER_MODEL     || 'meta-llama/llama-3.3-70b-instruct:free'),
        'process.env.NVIDIA_API_KEY':     JSON.stringify(env.NVIDIA_API_KEY       || process.env.NVIDIA_API_KEY       || ''),
        'process.env.NVIDIA_MODEL':       JSON.stringify(env.NVIDIA_MODEL         || process.env.NVIDIA_MODEL         || 'meta/llama-3.3-70b-instruct'),
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom']
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        dedupe: ['react', 'react-dom']
      }
    };
});
