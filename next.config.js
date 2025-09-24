/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dealsprints.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/www/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
