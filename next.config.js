/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm-adoption-images.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; 