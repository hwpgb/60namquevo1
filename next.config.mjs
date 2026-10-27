/** @type {import('next').NextConfig} */
const nextConfig = { typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true }, images: { remotePatterns: [{ protocol: 'https', hostname: 'i.postimg.cc' }], formats: ['image/webp'], minimumCacheTTL: 31536000 } };
export default nextConfig;
