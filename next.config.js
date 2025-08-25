
module.exports = {
  typescript: {
    ignoreBuildErrors: true, // TEMPORARY only
  },
  eslint: {
    ignoreDuringBuilds: true, // TEMPORARY only
  },
  env: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  }
}

