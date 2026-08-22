/** @type {import('next').NextConfig} */
const nextConfig = {
//     rewrites: async () => {
//     return [
//       {
//         source: '/api/:path*',
//         destination:
//           process.env.NODE_ENV === 'development'
//             ? 'http://127.0.0.1:5328/api/:path*'
//             : '/api/:path*',
//       },
//     ]
//   },
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        return config;
    },
    turbopack: {},
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'zettllhfmtvcunctalyo.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'www.citypng.com',
            },
            {
                protocol: 'https',
                hostname: 'd3kl8zsmmx4oop.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'web.archive.org',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    }
}

module.exports = nextConfig