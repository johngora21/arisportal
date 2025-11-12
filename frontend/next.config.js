/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:4001/api/v1/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:4001/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;



module.exports = nextConfig;


