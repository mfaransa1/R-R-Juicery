import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.199"],

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [60, 75, 85],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "xiijptyvnkxxujxvkglp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],

    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 128, 192, 256, 384],
  },
};

export default nextConfig;