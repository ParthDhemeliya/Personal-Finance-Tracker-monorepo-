/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://personal-finance-tracker-backend-kin7.onrender.com/api/:path*",
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
