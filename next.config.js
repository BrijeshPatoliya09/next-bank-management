/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: process.env.baseUrl
  },
  reactStrictMode: true
}

module.exports = nextConfig
