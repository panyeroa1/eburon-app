/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    OLLAMA_URL: process.env.OLLAMA_URL, // ✅ expose the env variable
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // don't drop other fallbacks
        fs: false, // disable fs in client bundle
        module: false,
        perf_hooks: false,
      };
    }

    return config;
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
