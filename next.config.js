/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // SVGRの設定
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
