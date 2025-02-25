import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', // localhost
        'localhost:8888',
      ],
    },
  },
}

export default withPayload(nextConfig)
