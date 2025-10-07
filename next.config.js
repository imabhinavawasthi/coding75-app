/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/:path*',
      },
    ]
  },
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        return config;
    },
    images: {
        domains: ["zettllhfmtvcunctalyo.supabase.co","upload.wikimedia.org","www.citypng.com","d3kl8zsmmx4oop.cloudfront.net","web.archive.org","images.unsplash.com"]
    }
}

module.exports = nextConfig