/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s3-alpha.figma.com', 'figma-alpha-api.s3.us-west-2.amazonaws.com'],
  },
  // We're not re-exporting environment variables in the config
  // to avoid exposing sensitive information
};

module.exports = nextConfig;
