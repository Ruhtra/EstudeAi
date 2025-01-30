import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: ["vdeckufzmvmcfnfcyugz.supabase.co"], // Adicione o domínio Supabase aqui
  },
};

export default nextConfig;
