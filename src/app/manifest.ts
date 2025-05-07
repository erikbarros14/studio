
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TrackFit Go',
    short_name: 'TrackFit Go',
    description: 'Track your runs, achieve your goals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#D3D3D3', // Light Gray
    theme_color: '#008080', // Teal
    icons: [ // Placeholder icons, not generating actual files
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
