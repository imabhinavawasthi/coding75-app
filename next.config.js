/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        return config;
    },
    images: {
        domains: ["zettllhfmtvcunctalyo.supabase.co"]
    }
}

module.exports = nextConfig