import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true }, // uncomment only if you must
};
export default nextConfig;
