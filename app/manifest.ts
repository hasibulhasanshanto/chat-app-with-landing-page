import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChatFlow — Modern Real-Time Messaging Platform',
    short_name: 'ChatFlow',
    description: 'Instant 1-to-1 conversations, group channels, and real-time team collaboration.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
