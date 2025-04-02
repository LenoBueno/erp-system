let userConfig = undefined;
// Remover a tentativa de importação que causa o erro
// try {
//   userConfig = await import('./v0-user-next.config');
// } catch (e) {
//   // ignore error if userConfig is not found
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
    path: '/_next/image',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  optimizeFonts: true,
  experimental: {
    serverComponentsExternalPackages: ['mysql2'],
    turbo: {
      loaders: {
        '.js': ['eslint-loader'],
        '.ts': ['eslint-loader'],
        '.tsx': ['eslint-loader'],
      },
    },
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
    };
    return config;
  },
};

// Removendo a tentativa de importar userConfig
// mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
