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
    'hub.lumitera.online',
    'lumitera.ru',
    'lumitera.online',
    '127.0.0.1',
    'localhost',
  ],
}

export default nextConfig