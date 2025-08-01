/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Remote patterns for when Azure Blob Storage is set up
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: '**.blob.core.windows.net',
      }
    ],
    unoptimized: true, // Disable image optimization
    dangerouslyAllowSVG: true,
  },
  // Add custom rewrites to handle missing image paths
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/placeholder/:path*', // Will be handled by a custom API route
      },
    ];
  }
};

module.exports = nextConfig;
