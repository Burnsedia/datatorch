/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer({
  async redirects() {
    return [
      {
        source: '/discussion',
        destination: '/discussion/general',
        permanent: true,
      },
    ]
  },
})
