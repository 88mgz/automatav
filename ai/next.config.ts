/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // (optional) temporarily bypass TS errors too
  // typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
