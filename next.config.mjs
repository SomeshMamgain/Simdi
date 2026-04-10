/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/product',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/product/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/shop/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },
       {
    source: '/products/kaafal',
    destination: '/products/kaafal-indian-bayberry',
    permanent: true,
  },
  {
    source: '/products/gauth',
    destination: '/products/gahat-organic-kulthi-dal',
    permanent: true,
  },
  {
    source: '/products/jhangora',
    destination: '/products/jhangora-barnyard-millet',
    permanent: true,
  },
  {
    source: '/products/chawal',
    destination: '/products/chawal-pahadi-white-rice',
    permanent: true,
  },
  {
    source: '/products/linguda',
    destination: '/products/lingad-kasrod-lingad',
    permanent: true,
  },
  {
    source: '/products/lahsun',
    destination: '/products/lahsun-himalayan-garlic',
    permanent: true,
  },
  {
    source: '/products/pahadi-mooli',
    destination: '/products/mooli-himalyan-redish',
    permanent: true,
  },
  {
    source: '/products/ragi',
    destination: '/products/mandua-ragi-koda',
    permanent: true,
  },
  {
    source: '/products/kankoda',
    destination: '/products/sisaun-kankoda',
    permanent: true,
  },
  {
    source: '/products/bal-mithai',
    destination: '/products/bal-mithai-pahadi-chocolate',
    permanent: true,
  },
  {
    source: '/products/pisyu-loon',
    destination: '/products/pahadi-rock-salt',
    permanent: true,
  },
  {
    source: '/products/pahadi-jau',
    destination: '/products/barley-seeds',
    permanent: true,
  },
  {
    source: '/products/buransh',
    destination: '/products/pahadi-blossom-juice',
    permanent: true,
  },
  {
    source: '/products/pahadi-honey',
    destination: '/products/pahadi-shahad',
    permanent: true,
  },
  {
    source: '/products/jakhya',
    destination: '/products/wild-mustard-seeds',
    permanent: true,
  },
  {
    source: '/products/pahadi-akhrot',
    destination: '/products/pahadi-walnut',
    permanent: true,
  },
  {
    source: '/products/pahadi-dhaniya',
    destination: '/products/pahadi-coriander-seeds',
    permanent: true,
  },
  {
    source: '/products/pahadi-rajma-mix-dal',
    destination: '/products/himalayan-rajma-mix',
    permanent: true,
  },
  {
    source: '/products/pahadi-amla',
    destination: '/products/pahadi-powerberry',
    permanent: true,
  },
  {
    source: '/products/pahadi-sea-buckthorn-juice',
    destination: '/products/himalayan-omega-boost',
    permanent: true,
  },
  {
    source: '/products/arsa',
    destination: '/products/pahadi-arsa-mithaas',
    permanent: true,
  },
  {
    source: '/products/pahadi-red-chilli-powder',
    destination: '/products/pahadi-red-blaze',
    permanent: true,
  },
  {
    source: '/products/kode-ke-biscuit',
    destination: '/products/pahadi-millet-biscuits',
    permanent: true,
  },
  {
    source: '/products/pahadi-malta-squash',
    destination: '/products/malta-squash',
    permanent: true,
  },
  {
    source: '/products/buffalo-ghee',
    destination: '/products/pahadi-buffalo-ghee',
    permanent: true,
  },
  {
    source: '/products/kathal-ka-achaar',
    destination: '/products/jackfruit-pickle',
    permanent: true,
  }
    ]
  },
}

export default nextConfig
