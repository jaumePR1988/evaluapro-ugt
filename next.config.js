/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ebiqbjgrmjdkwlckmpuj.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
