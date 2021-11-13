/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  experimental: {
    // @link https://github.com/vercel/next.js/pull/22867
    externalDir: true, // adds support to import the shared lib
  },
};
