/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/gateway/:path*',
        destination: process.env.GATEWAY_SERVICE_URL || 'http://localhost:3000'+'/:path*',
      },
    ];
  },
};

export default nextConfig;
