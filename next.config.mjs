/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  experimental: {
    proxyTimeout: 30000000,
  },
  async rewrites() {
    return [
      {
        source: '/gateway/:path*',
        destination: process.env.GATEWAY_SERVICE_URL
          ? process.env.GATEWAY_SERVICE_URL + '/:path*'
          : 'http://gatewayservice:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
