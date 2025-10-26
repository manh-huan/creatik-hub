/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: false
  },
  images: {
    domains: ['localhost', 's3.amazonaws.com', 'r2.dev']
  }
}

module.exports = nextConfig
