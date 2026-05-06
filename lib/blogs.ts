export type BlogContentBlock =
  | {
      type: 'paragraph'
      text: string
    }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
    }
  | {
      type: 'section'
      title: string
      paragraphs?: string[]
      list?: string[]
      image?: {
        src: string
        alt: string
      }
    }
  | {
      type: 'benefits'
      title: string
      items: {
        title: string
        description: string
      }[]
    }

export type Blog = {
  id: number
  title: string
  slug: string
  date: string
  publishedAt: string
  excerpt: string
  image: string
  imageAlt: string
  fullContent: BlogContentBlock[]
  metaTitle: string
  metaDescription: string
  keywords: string[]
  productHref?: string
  productCta?: string
}

export const blogs: Blog[] = [
  {
    id: 4,
    title: 'Pisyu Loon: The Stone-Ground Himalayan Salt That Defines Real Taste',
    slug: 'pisyu-loon-pahadi-rock-salt',
    date: 'April 27, 2026',
    publishedAt: '2026-04-27T00:00:00.000Z',
    excerpt:
      'Discover the authentic stone-ground Himalayan salt blend that adds real Pahadi flavor to every meal.',
    image: '/product_images/pisyu_loon/pisyu_loon.webp',
    imageAlt: 'Authentic stone-ground Himalayan Pisyu Loon salt',
    metaTitle: 'Pisyu Loon: Stone-Ground Himalayan Salt Guide | Simdi',
    metaDescription:
      'Learn what Pisyu Loon is, how Uttarakhand families stone-grind this Himalayan salt blend, and why it brings authentic Pahadi flavor to everyday food.',
    keywords: [
      'Pisyu Loon',
      'Pahadi rock salt',
      'Himalayan salt blend',
      'stone-ground salt',
      'Uttarakhand spices',
    ],
    productHref: '/products/pahadi-rock-salt',
    productCta: 'Shop Pisyu Loon',
    fullContent: [
      {
        type: 'paragraph',
        text:
          'In the villages of Uttarakhand, taste was never manufactured. It was created slowly, patiently, and with care. Pisyu Loon is one such timeless preparation, made by grinding rock salt with herbs and spices on stone. At Simdi, we bring this handcrafted Pahadi blend directly to your kitchen while preserving the soul of Himalayan seasoning.',
      },
      {
        type: 'image',
        src: '/product_images/pisyu_loon/pisyu_loon.webp',
        alt: 'A jar of Pisyu Loon Himalayan rock salt blend',
      },
      {
        type: 'section',
        title: 'What is Pisyu Loon?',
        paragraphs: [
          'Pisyu Loon means ground salt. It is a traditional Himalayan spice blend made using pure rock salt, garlic, green chillies, coriander, and local herbs.',
          'Unlike machine-processed salts, every grain is crushed by hand using a sil-batta. This traditional method helps preserve natural oils, aroma, and a coarse texture that feels alive on the tongue.',
        ],
        image: {
          src: '/product_images/pisyu_loon/pisyu_loon2.webp',
          alt: 'Traditional stone grinding process used to prepare Pisyu Loon',
        },
      },
      {
        type: 'section',
        title: 'The Science of Stone-Grinding',
        paragraphs: [
          'Stone-grinding is gentle. It releases the essential oils from garlic, coriander, and herbs without overheating them, which helps retain both flavor and character.',
          'The result is a salt blend that carries trace minerals, fresh aroma, and a layered taste that can brighten simple dal, cucumber, curd, rice, rotis, and roasted snacks.',
        ],
        list: [
          'Natural trace minerals from Himalayan rock salt',
          'Essential oils released from fresh herbs and garlic',
          'No anti-caking agents or artificial additives',
          'Small-batch preparation by local women',
        ],
      },
      {
        type: 'benefits',
        title: 'Benefits of Pisyu Loon',
        items: [
          {
            title: 'Supports Digestion',
            description:
              'Traditional herbs, raw garlic, and coriander are valued in hill kitchens for helping make meals feel lighter.',
          },
          {
            title: 'Rich in Trace Minerals',
            description:
              'Unrefined rock salt naturally carries minerals that are often missing from heavily processed table salt.',
          },
          {
            title: 'Intense Natural Flavor',
            description:
              'Because the blend is bold and aromatic, a small pinch can season food beautifully.',
          },
          {
            title: 'Handcrafted Character',
            description:
              'The sil-batta texture gives Pisyu Loon a rustic finish that machine grinding cannot reproduce.',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "The Crimson Flower of the Hills: Why Buransh is Uttarakhand's Most Powerful Wild Drink",
    slug: 'buransh-rhododendron-sharbat',
    date: 'April 23, 2026',
    publishedAt: '2026-04-23T00:00:00.000Z',
    excerpt:
      "Every spring, Uttarakhand's forests turn flame-red with Buransh flowers, and hill families press them into a ruby seasonal drink.",
    image: '/product_images/buransh/buransh.webp',
    imageAlt: 'Wild Buransh rhododendron flowers from Pauri Garhwal',
    metaTitle: 'Buransh Rhododendron Sharbat Benefits & Story | Simdi',
    metaDescription:
      "Discover Buransh, Uttarakhand's crimson rhododendron flower, and learn how this wild seasonal drink is made in the Himalayan hills.",
    keywords: [
      'Buransh sharbat',
      'rhododendron drink',
      'Uttarakhand state tree',
      'Himalayan summer drink',
      'Pauri Garhwal Buransh',
    ],
    productHref: '/products/pahadi-blossom-juice',
    productCta: 'Shop Buransh Sharbat',
    fullContent: [
      {
        type: 'paragraph',
        text:
          'Every spring, when the snow retreats and the Himalayan forests of Uttarakhand burst into flame-red color, a single flower announces the season: Buransh. For centuries, hill families in Kumaon and Garhwal have pressed its petals into a deep ruby drink that tastes like the mountains themselves.',
      },
      {
        type: 'image',
        src: '/product_images/buransh/buransh.webp',
        alt: 'A bottle of Buransh sharbat made from Himalayan rhododendron flowers',
      },
      {
        type: 'section',
        title: 'What is Buransh?',
        paragraphs: [
          "Buransh is the common name for Rhododendron arboreum, Uttarakhand's state tree and one of the most recognizable sights in the mid-Himalayan forests.",
          'Its crimson flowers bloom from February to April between roughly 4,000 and 8,000 feet. The flowers are harvested by mountain communities and traditionally used in sharbat, squash, chutney, and seasonal drinks.',
        ],
        image: {
          src: '/product_images/buransh/buransh2.webp',
          alt: 'Buransh flowers harvested in Uttarakhand',
        },
      },
      {
        type: 'section',
        title: 'Ancient Drink, Modern Curiosity',
        paragraphs: [
          'Buransh has long been part of folk food culture in the Himalayan region. Its petals are naturally bright, sweet-tart, and refreshing, which makes them ideal for warm-weather drinks.',
          'At Simdi, Buransh sharbat is prepared in small batches from seasonal flowers so the drink stays close to its traditional hill-kitchen roots.',
        ],
        list: [
          'Made from seasonal rhododendron flowers',
          'Naturally sweet-tart and refreshing',
          'Prepared in small batches',
          'Connected to generations of Uttarakhand food culture',
        ],
      },
      {
        type: 'benefits',
        title: 'Why People Love Buransh Sharbat',
        items: [
          {
            title: 'Natural Summer Cooler',
            description:
              'Buransh sharbat is traditionally enjoyed as a refreshing drink during warmer months.',
          },
          {
            title: 'Vivid Botanical Flavor',
            description:
              'The flower gives the drink a ruby color and a sweet-tart taste that feels distinctly Himalayan.',
          },
          {
            title: 'Seasonal and Wild',
            description:
              'Buransh blooms for a short window each year, making every batch tied to a specific mountain season.',
          },
          {
            title: 'Cultural Heritage',
            description:
              'The drink carries the memory of village kitchens, forest trails, and spring harvests.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Kaafal: The Wild Himalayan Berry You Didn't Know You Needed",
    slug: 'kaafal-superfruit',
    date: 'April 16, 2026',
    publishedAt: '2026-04-16T00:00:00.000Z',
    excerpt:
      'Discover the tangy-sweet magic of Kaafal, a rare forest fruit from Uttarakhand that ripens for only a short season.',
    image: '/kaafal.png',
    imageAlt: 'Wild Kaafal berries from the Himalayan forests',
    metaTitle: 'Kaafal: Wild Himalayan Berry Benefits & Story | Simdi',
    metaDescription:
      'Meet Kaafal, the rare wild Himalayan berry from Uttarakhand. Learn what makes this seasonal fruit special and how Simdi sources it.',
    keywords: [
      'Kaafal',
      'Myrica esculenta',
      'Himalayan berry',
      'wild Uttarakhand fruit',
      'Kaafal benefits',
    ],
    productHref: '/products/kaafal-indian-bayberry',
    productCta: 'Shop Kaafal',
    fullContent: [
      {
        type: 'paragraph',
        text:
          'Hidden in the oak and rhododendron forests of Uttarakhand, a wild berry ripens every spring that hill families have eaten for centuries. Kaafal is a tangy, ruby-red forest fruit that grows naturally in the Himalayas and carries the bright taste of the hills.',
      },
      {
        type: 'image',
        src: '/kaafal.webp',
        alt: 'Wild Kaafal berries from the forests of Pauri Garhwal',
      },
      {
        type: 'section',
        title: 'What is Kaafal?',
        paragraphs: [
          'Kaafal is the Himalayan bayberry, known botanically as Myrica esculenta. It fruits once a year between March and May, when the snow melts and the hillsides begin to warm.',
          'The berries are small, deeply pigmented, and intensely flavored. Because Kaafal grows in wild forests and is not commercially farmed at scale, each harvest is seasonal and limited.',
        ],
        image: {
          src: '/kaafal3.webp',
          alt: 'Hand-harvested Kaafal berries from Himalayan forest trails',
        },
      },
      {
        type: 'section',
        title: 'Why Kaafal Feels So Special',
        paragraphs: [
          "Part of Kaafal's magic is scarcity. It appears for a short window, changes quickly after picking, and has always been closely tied to the rhythms of mountain life.",
          'At Simdi, Kaafal is processed minimally so its tartness, color, and wild character stay close to the original fruit.',
        ],
        list: [
          'Wild seasonal fruit from Himalayan forests',
          'Tangy-sweet flavor with a deep red color',
          'Harvested during a short spring window',
          'Closely connected with Uttarakhand folk food traditions',
        ],
      },
      {
        type: 'benefits',
        title: 'Traditional and Modern Reasons to Try Kaafal',
        items: [
          {
            title: 'Naturally Tart and Bright',
            description:
              'Kaafal has a lively sweet-sour taste that works beautifully in sharbat, dried fruit, and seasonal preparations.',
          },
          {
            title: 'Forest-Grown',
            description:
              'The fruit grows in Himalayan forests without conventional orchard farming.',
          },
          {
            title: 'Seasonal Rarity',
            description:
              'Its short harvest window makes Kaafal one of the most anticipated hill fruits of spring.',
          },
          {
            title: 'Cultural Memory',
            description:
              'For many Pahadi families, Kaafal is not just a fruit. It is childhood, forest walks, and the first taste of summer.',
          },
        ],
      },
    ],
  },
  {
    id: 1,
    title: 'From High-Altitude Pastures to Your Home: The Sacred Journey of Badri Cow Ghee',
    slug: 'pahadi-superfoods',
    date: 'April 3, 2026',
    publishedAt: '2026-04-03T00:00:00.000Z',
    excerpt: 'Experience the rare potency of Himalayan A2 Badri cow ghee from Pauri Garhwal.',
    image: '/ghee1.jpg',
    imageAlt: 'A2 Badri Cow Ghee by Simdi',
    metaTitle: 'A2 Badri Cow Ghee: Himalayan Bilona Ghee Guide | Simdi',
    metaDescription:
      'Learn why A2 Badri Cow Ghee from Pauri Garhwal stands out, from the traditional Bilona process to its role in Himalayan food culture.',
    keywords: [
      'A2 Badri Cow Ghee',
      'Bilona ghee',
      'Himalayan ghee',
      'Pauri Garhwal ghee',
      'traditional ghee',
    ],
    productHref: '/products',
    productCta: 'Shop Authentic Bilona Ghee',
    fullContent: [
      {
        type: 'paragraph',
        text:
          'Deep in the high-altitude pastures of Pauri Garhwal, the hardy Badri cow grazes on mountain vegetation. The milk is rare, and the ghee made from it has long been treasured in Himalayan homes for its aroma, depth, and place in everyday nourishment.',
      },
      {
        type: 'image',
        src: '/badricow.png',
        alt: 'Badri cow in the Himalayan hills',
      },
      {
        type: 'section',
        title: 'The Legend of the Badri Cow',
        paragraphs: [
          'The Badri cow is native to the Himalayan region. Smaller and hardier than commercial dairy breeds, it is adapted to steep terrain, changing weather, and mountain grazing.',
          'Families in the hills value Badri cow milk for its rarity and traditional role in food, rituals, and home kitchens.',
        ],
        image: {
          src: '/badricow2.png',
          alt: 'Traditional Himalayan Badri cow dairy culture',
        },
      },
      {
        type: 'section',
        title: 'The Bilona Difference',
        paragraphs: [
          'The Bilona method begins by turning milk into curd. The curd is then churned to separate butter, and the butter is slow-cooked into ghee.',
          'This slower process creates a rich nutty aroma and a texture that feels very different from industrial cream-separated ghee.',
        ],
        list: [
          'Milk is first cultured into curd',
          'Curd is hand-churned to extract makkhan',
          'Makkhan is slow-cooked into ghee',
          'Small-batch preparation protects aroma and depth',
        ],
      },
      {
        type: 'benefits',
        title: 'Why Badri Ghee Belongs in the Kitchen',
        items: [
          {
            title: 'Rich Traditional Flavor',
            description:
              'Bilona ghee has a deep, nutty aroma that elevates dal, rotis, rice, khichdi, and sweets.',
          },
          {
            title: 'High Smoke Point',
            description:
              'Ghee is well suited to Indian cooking because it handles heat better than many delicate fats.',
          },
          {
            title: 'Slow Food Craft',
            description:
              'The process honors time, patience, and the dairy traditions of the Himalayan region.',
          },
          {
            title: 'Mountain Provenance',
            description:
              'Badri ghee connects the kitchen to the pastures and village networks of Pauri Garhwal.',
          },
        ],
      },
    ],
  },
]

export function getBlogBySlug(slug: string) {
  return blogs.find((blog) => blog.slug === slug)
}

export function getRelatedBlogs(currentSlug: string, limit = 3) {
  return blogs.filter((blog) => blog.slug !== currentSlug).slice(0, limit)
}
