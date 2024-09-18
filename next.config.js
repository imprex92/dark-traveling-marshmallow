module.exports = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  serverRuntimeConfig: {
    type: process.env.ADMIN_FIREBASE_TYPE,
    project_id: process.env.ADMIN_FIREBASE_PROJECT_ID,
    private_key_id: process.env.ADMIN_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.ADMIN_FIREBASE_PRIVATE_KEY,
    client_email: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.ADMIN_FIREBASE_CLIENT_ID,
    auth_uri: process.env.ADMIN_FIREBASE_AUTH_URI,
    token_uri: process.env.ADMIN_FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.ADMIN_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.ADMIN_FIREBASE_CLIENT_X509_CERT_URL,
    univers_domain: process.env.ADMIN_FIREBASE_UNIVERSE_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_PROJECT_FIREBASE_DATABASE_URL,
  }, // Will be available on server
  publicRuntimeConfig: {}, // Will be available on both server and client

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push(
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      },
    )

    return config
  },
}
