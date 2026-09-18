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
    async redirects() {
        return [
            {
                source: '/dsa-cp',
                destination: '/contests',
                permanent: false,
            },
            {
                source: '/leetcode-potd',
                destination: '/contests/leetcode-potd',
                permanent: false,
            },
            {
                source: '/dsa-cp/leetcode-potd',
                destination: '/contests/leetcode-potd',
                permanent: false,
            },
            {
                source: '/dsa-cp/codeforces',
                destination: '/contests/codeforces',
                permanent: false,
            },
            {
                source: '/dsa-cp/codechef',
                destination: '/contests/codechef',
                permanent: false,
            },
            {
                source: '/dsa-cp/leetcode-potd/:slug',
                destination: '/contests/leetcode-potd/:slug',
                permanent: false,
            },
            {
                source: '/content/leetcode-potd/:slug*',
                destination: '/contests/leetcode-potd/:slug*',
                permanent: false,
            },
            {
                source: '/dsa-cp/leetcode-contests',
                destination: '/contests/leetcode',
                permanent: false,
            },
            {
                source: '/dsa-cp/sheets',
                destination: '/dsa/sheets',
                permanent: false,
            },
            {
                source: '/dsa-cp/sheets/:sheet*',
                destination: '/dsa/sheets/:sheet*',
                permanent: false,
            },
            {
                source: '/problem/:slug*',
                destination: '/dsa/problem/:slug*',
                permanent: false,
            },
        ];
    },
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