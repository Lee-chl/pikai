/** @type {import('next').NextConfig} */
const fullUrl = globalThis.process.env.NEXT_PUBLIC_IMAGE_URL;
let imageHost = "";
if (fullUrl) {
  try {
    imageHost = new URL(fullUrl).hostname;
  } catch (e) {
    console.log("올바르지 않은 URL 형식입니다.", e);
  }
}

const nextConfig = {
  transpilePackages: ["@repo/common"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageHost,
      },
    ],
  },
};

export default nextConfig;
