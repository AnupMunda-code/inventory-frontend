/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't fail production builds on ESLint warnings/errors (e.g. unescaped
  // entities, <img> usage). Genuine bugs are fixed in code.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
