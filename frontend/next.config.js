/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false
  },
  images: {
    domains: ['localhost', 's3.amazonaws.com', 'r2.dev']
  }
}

module.exports = nextConfig
