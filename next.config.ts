import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vdeckufzmvmcfnfcyugz.supabase.co",
      },
    ],
  },


  // Do not use permanet why save in cache client side
  async redirects() {
    return [
      {
        source: "/admin/exams/:id",
        destination: "/admin/exams/:id/questions",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
