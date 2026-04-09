/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  env: {
    HF_API_TOKEN: process.env.HF_API_TOKEN,
  },
};

module.exports = nextConfig;
