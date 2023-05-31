/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: process.env.baseUrl,
    apiUrl: `${process.env.baseUrl}/api`,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
