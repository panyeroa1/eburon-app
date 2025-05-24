/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    OLLAMA_URL: process.env.OLLAMA_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm-adoption-images.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        perf_hooks: false,
      };
    }

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
