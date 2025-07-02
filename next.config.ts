import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "https://vipapp-production.up.railway.app/admin",
        permanent: false, // use true se quiser um redirecionamento 301
      },
    ];
  },
};

export default nextConfig;
