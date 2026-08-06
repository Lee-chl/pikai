/** @type {import('next').NextConfig} */
const env = globalThis.process?.env || {};
const fullUrl = env.NEXT_PUBLIC_IMAGE_URL;
let imageHost = "";

if (fullUrl && fullUrl !== "undefined" && fullUrl.startsWith("http")) {
  try {
    imageHost = new URL(fullUrl).hostname;
  } catch (e) {
    console.log("올바르지 않은 URL 형식입니다.", e);
  }
}

const nextConfig = {
  basePath: "/pikai",
  output: "standalone",
  transpilePackages: ["@repo/common"],
  // 모노레포에서 @repo/common 등이 standalone에 포함되도록 루트 지정
  outputFileTracingRoot: path.join(__dirname, "../.."),
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageHost || "localhost",
      },
    ],
  },
};

export default nextConfig;
