/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/gateway/:path*',
        destination: process.env.GATEWAY_SERVICE_URL
          ? process.env.GATEWAY_SERVICE_URL + '/:path*'
          : 'http://localhost:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
