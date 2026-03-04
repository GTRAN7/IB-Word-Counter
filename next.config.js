/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    // Disable filesystem cache in dev to avoid pack.gz race condition errors
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
