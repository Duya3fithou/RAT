/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Giảm số lượng file watching để tránh EMFILE error trên macOS
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
      ignored: ['**/node_modules', '**/.next', '**/.git'],
    }
    return config
  },
}

export default nextConfig
