/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/images/:path*', destination: '/api/images/:path*' },
      ],
    }
  },
};

export default nextConfig;
