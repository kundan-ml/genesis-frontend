import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true, // Keep this outside of PWA options
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    STRIPE_PROMISE_KEY: process.env.STRIPE_PROMISE_KEY,
    GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GITHUB_CLIENT: process.env.GITHUB_CLIENT,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    IMAGE_URL: process.env.IMAGE_URL,
  },
  images: {
    domains: process.env.IMAGE_URL
      ? process.env.IMAGE_URL.split(',')
      : [],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 720, 1024],
  },
  
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // Enable PWA in both development and production
})(nextConfig);
