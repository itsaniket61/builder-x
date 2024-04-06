/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/gateway/:path*',
        destination: process.env.GATEWAY_SERVICE_URL+'/:path*',
      },
    ];
  },
};

export default nextConfig;
