/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '100.74.10.186',
    'portal.lumitera.online',
    '127.0.0.1',
    'localhost',
  ],
  async rewrites() {
    return [
      {
        source: '/api/portal',
        destination: 'https://n8n.lumitera.online/webhook/portal'
      }
    ]
  }
}

export default nextConfig
