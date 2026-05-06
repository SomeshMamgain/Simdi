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
  id: 6,
  title: "Sea Buckthorn Juice: The Himalayan Superfruit Packed with Nutrition",
  slug: "sea-buckthorn-juice-benefits",
  date: "May 6, 2026",
  publishedAt: "2026-05-06T00:00:00.000Z",
  excerpt:
    "Discover the health benefits of Himalayan sea buckthorn juice, a nutrient-rich superfruit drink known for immunity, skin health, and energy.",
  image: "/product_images/Seabuckthorn/Seabuckthorn.webp",
  imageAlt: "Fresh Himalayan sea buckthorn juice",
  metaTitle: "Sea Buckthorn Juice Benefits & Uses | Simdi",
  metaDescription:
    "Learn why Himalayan sea buckthorn juice is considered a superfood packed with vitamins, antioxidants, and natural wellness benefits.",
  keywords: [
    "sea buckthorn juice",
    "Himalayan superfruit",
    "natural immunity drink",
    "sea buckthorn benefits",
    "healthy juice India",
  ],
  productHref: "/products/himalayan-omega-boost",
  productCta: "Shop Sea Buckthorn Juice",
  fullContent: [
    {
      type: "paragraph",
      text:
        "Growing naturally in the cold Himalayan regions, sea buckthorn is a bright orange berry known for its exceptional nutritional value. For centuries, local communities in Ladakh and Uttarakhand have consumed sea buckthorn juice as a natural health tonic. Rich in vitamins, antioxidants, and essential fatty acids, this juice has gained global popularity as a superfood drink that supports immunity, skin health, and overall wellness.",
    },
    {
      type: "section",
      title: "Why Sea Buckthorn is Called a Superfruit",
      paragraphs: [
        "Sea buckthorn berries contain rare nutrients that are difficult to find together in a single fruit. They are naturally rich in Vitamin C, Vitamin E, omega fatty acids, and antioxidants.",
        "Unlike artificial supplements, sea buckthorn juice offers nutrients in a natural form, making it easier for the body to absorb and utilize.",
      ],
      list: [
        "Rich in Vitamin C and antioxidants",
        "Supports skin and immune health",
        "Naturally energizing",
        "Traditionally used in Himalayan wellness practices",
      ],
      image: {
        src: "/product_images/Seabuckthorn/Seabuckthorn1.webp",
        alt: "Fresh Himalayan sea buckthorn juice in a glass",
      },
    },
    {
      type: "benefits",
      title: "Health Benefits of Sea Buckthorn Juice",
      items: [
        {
          title: "Boosts Immunity",
          description:
            "Its high Vitamin C content helps strengthen the immune system naturally.",
        },
        {
          title: "Supports Healthy Skin",
          description:
            "Antioxidants and omega oils help maintain glowing and hydrated skin.",
        },
        {
          title: "Improves Energy Levels",
          description:
            "Provides natural nourishment and helps reduce fatigue.",
        },
        {
          title: "Supports Heart Health",
          description:
            "Contains beneficial fatty acids that may support cardiovascular wellness.",
        },
      ],
    },
    {
      type: "section",
      title: "How to Consume Sea Buckthorn Juice",
      paragraphs: [
        "Sea buckthorn juice can easily become part of your daily routine. Its tangy flavor makes it refreshing and versatile.",
      ],
      list: [
        "Drink diluted with water every morning",
        "Add to smoothies",
        "Use in mocktails and herbal drinks",
        "Consume chilled during summer",
      ],
    },
    {
      type: "section",
      title: "Frequently Asked Questions (FAQs)",
      paragraphs: [],
      list: [
        "Is sea buckthorn juice good for immunity? Yes, it is naturally rich in Vitamin C and antioxidants.",
        "Can I drink sea buckthorn juice daily? Yes, moderate daily consumption is common.",
        "What does sea buckthorn juice taste like? It has a tangy and citrus-like flavor.",
        "Is sea buckthorn naturally grown in the Himalayas? Yes, it grows in high-altitude Himalayan regions.",
      ],
    },
  ],
},
{
  id: 7,
  title: "Bal Mithai: The Iconic Sweet Delight from Uttarakhand",
  slug: "bal-mithai-uttarakhand",
  date: "May 6, 2026",
  publishedAt: "2026-05-06T00:00:00.000Z",
  excerpt:
    "Explore the rich taste and cultural history of Bal Mithai, the famous chocolate-like sweet from Uttarakhand.",
  image: "/product_images/bal_mithai/bal_mithai.webp",
  imageAlt: "Traditional Bal Mithai sweet from Uttarakhand",
  metaTitle: "Bal Mithai Sweet from Uttarakhand | Simdi",
  metaDescription:
    "Learn about Bal Mithai, Uttarakhand’s famous traditional sweet made from khoya and sugar balls with a rich caramel flavor.",
  keywords: ["Bal Mithai", "Uttarakhand sweets", "traditional mithai", "pahadi sweets", "khoya sweet"],
  productHref: "/products/bal-mithai",
  productCta: "Shop Bal Mithai",
  fullContent: [
    {
      type: "paragraph",
      text:
        "Bal Mithai is one of Uttarakhand’s most loved traditional sweets. Made using roasted khoya and coated with tiny sugar balls, this unique dessert has a deep caramel flavor and rich texture. Originating from the Kumaon region, Bal Mithai is more than just a sweet — it is a symbol of celebration, tradition, and mountain hospitality.",
    },
    {
      type: "section",
      title: "The History Behind Bal Mithai",
      paragraphs: [
        "Bal Mithai has been prepared in Uttarakhand for generations and is commonly served during festivals, weddings, and family gatherings.",
        "Its chocolate-like appearance and rich flavor make it stand out among traditional Indian sweets.",
      ],
      list: [
        "Traditional sweet from Kumaon",
        "Prepared using roasted khoya",
        "Decorated with sugar pearls",
        "Popular during festivals and celebrations",
      ],
      image: {
        src: "/product_images/bal_mithai/bal_mithai2.webp",
        alt: "Traditional Bal Mithai sweet from Uttarakhand",
      },
    },
    {
      type: "benefits",
      title: "Why People Love Bal Mithai",
      items: [
        {
          title: "Rich Traditional Taste",
          description:
            "Offers a unique caramelized flavor unlike most sweets.",
        },
        {
          title: "Cultural Importance",
          description:
            "Strongly connected to Uttarakhand’s food heritage.",
        },
        {
          title: "Perfect Festive Dessert",
          description:
            "Often gifted and shared during celebrations.",
        },
      ],
    },
    {
      type: "section",
      title: "Frequently Asked Questions (FAQs)",
      paragraphs: [],
      list: [
        "What is Bal Mithai made of? It is made from roasted khoya and sugar balls.",
        "Which state is famous for Bal Mithai? Uttarakhand is famous for Bal Mithai.",
        "Does Bal Mithai taste like chocolate? It has a caramel-like flavor similar to chocolate fudge.",
        "Can Bal Mithai be gifted? Yes, it is commonly gifted during festivals.",
      ],
    },
  ],
},
{
  id: 8,
  title: "Bhatt Ki Daal: Uttarakhand’s Protein-Rich Black Soybean",
  slug: "bhatt-ki-daal-benefits",
  date: "May 6, 2026",
  publishedAt: "2026-05-06T00:00:00.000Z",
  excerpt:
    "Discover Bhatt ki daal, the traditional black soybean from Uttarakhand known for its rich taste and high nutrition.",
  image: "/product_images/pahadi_bhatt/pahadi_bhatt.webp",
  imageAlt: "Traditional Bhatt ki daal from Uttarakhand",
  metaTitle: "Bhatt Ki Daal Benefits & Nutrition | Simdi",
  metaDescription:
    "Learn about Bhatt ki daal, a protein-rich Himalayan black soybean widely used in traditional Uttarakhand cuisine.",
  keywords: ["Bhatt ki daal", "black soybean", "Uttarakhand pulses", "protein rich daal", "pahadi food"],
  productHref: "/products/pahadi-bhatt-dal",
  productCta: "Shop Bhatt Daal",
  fullContent: [
    {
      type: "paragraph",
      text:
        "Bhatt ki daal is a traditional Himalayan pulse grown mainly in Uttarakhand. Known as black soybean, it has been a staple in pahadi kitchens for centuries. Rich in protein, fiber, and minerals, Bhatt ki daal is both nutritious and comforting. It is commonly prepared as Bhatt ki Churkani, a famous Kumaoni dish with deep earthy flavors.",
    },
    {
      type: "section",
      title: "Why Bhatt Daal is Nutritious",
      paragraphs: [
        "Bhatt ki daal contains high-quality plant protein and essential nutrients that make it a healthy addition to daily meals.",
        "Its traditional cultivation in Himalayan regions also means it is often grown naturally with minimal chemical use.",
      ],
      list: [
        "High in protein",
        "Rich in fiber and iron",
        "Traditional Himalayan crop",
        "Popular in Kumaoni cuisine",
      ],
       image: {
        src: "/product_images/pahadi_bhatt/pahadi_bhatt3.webp",
        alt: "Traditional Bhatt ki daal from Uttarakhand",
      },
    },
    {
      type: "benefits",
      title: "Health Benefits of Bhatt Daal",
      items: [
        {
          title: "Supports Muscle Health",
          description:
            "Its protein content helps support muscle repair and strength.",
        },
        {
          title: "Good for Digestion",
          description:
            "Contains dietary fiber that supports digestive health.",
        },
        {
          title: "Provides Long-lasting Energy",
          description:
            "Complex carbohydrates keep you full for longer.",
        },
      ],
    },
    {
      type: "section",
      title: "Frequently Asked Questions (FAQs)",
      paragraphs: [],
      list: [
        "What is Bhatt ki daal? It is a traditional black soybean grown in Uttarakhand.",
        "Is Bhatt daal high in protein? Yes, it is naturally protein-rich.",
        "How is Bhatt daal cooked? It is commonly prepared as Bhatt ki Churkani.",
        "Is Bhatt daal healthy? Yes, it contains fiber, protein, and minerals.",
      ],
    },
  ],
},
{
  id: 9,
  title: "Gahat Daal: The Traditional Horse Gram of the Himalayas",
  slug: "gahat-daal-benefits",
  date: "May 6, 2026",
  publishedAt: "2026-05-06T00:00:00.000Z",
  excerpt:
    "Learn about Gahat daal, the nutrient-rich horse gram widely consumed in Uttarakhand for warmth and strength.",
  image: "/product_images/gauth/gauth.webp",
  imageAlt: "Traditional Gahat daal from Uttarakhand",
  metaTitle: "Gahat Daal Benefits & Nutrition | Simdi",
  metaDescription:
    "Explore the nutritional value and traditional uses of Gahat daal, a protein-rich Himalayan horse gram.",
  keywords: ["Gahat daal", "horse gram", "pahadi daal", "Uttarakhand food", "healthy pulses"],
  productHref: "/products/gahat-organic-kulthi-dal",
  productCta: "Shop Gahat Daal",
  fullContent: [
    {
      type: "paragraph",
      text:
        "Gahat daal, also known as horse gram, is one of the oldest pulses cultivated in the Himalayan region. In Uttarakhand, it is valued for its warming nature and nutritional richness. Traditionally consumed during winters, Gahat daal is known for supporting digestion, strength, and overall wellness.",
    },
    {
      type: "benefits",
      title: "Health Benefits of Gahat Daal",
      items: [
        {
          title: "Rich in Protein",
          description:
            "Supports a balanced vegetarian diet.",
        },
        {
          title: "Keeps the Body Warm",
          description:
            "Traditionally consumed during cold weather.",
        },
        {
          title: "Supports Digestion",
          description:
            "Contains fiber that helps digestive health.",
        },
      ],
    },
    {
      type: "section",
      title: "Frequently Asked Questions (FAQs)",
      paragraphs: [],
      list: [
        "What is Gahat daal? It is horse gram traditionally consumed in Uttarakhand.",
        "Is Gahat daal healthy? Yes, it is rich in protein and fiber.",
        "When is Gahat daal usually eaten? Mostly during winters.",
        "Can Gahat daal be included in daily meals? Yes, in moderate amounts.",
      ],
       image: {
        src: "/product_images/gauth/gauth2.webp",
        alt: "Traditional Gahat daal from Uttarakhand",
      },
    },
  ],
},
{
  id: 10,
  title: "Ragi Millets: Ancient Himalayan Grain for Modern Nutrition",
  slug: "ragi-millet-benefits",
  date: "May 6, 2026",
  publishedAt: "2026-05-06T00:00:00.000Z",
  excerpt:
    "Discover why ragi millet is considered one of the healthiest grains for energy, calcium, and balanced nutrition.",
  image: "/product_images/ragi/ragi.webp",
  imageAlt: "Healthy ragi millet grains",
  metaTitle: "Ragi Millet Benefits & Nutrition | Simdi",
  metaDescription:
    "Learn about the benefits of ragi millets, an ancient grain rich in calcium, fiber, and natural nutrition.",
  keywords: ["ragi millet", "healthy grains", "millets India", "finger millet", "natural nutrition"],
  productHref: "/products/mandua-ragi-koda",
  productCta: "Shop Ragi Millets",
  fullContent: [
    {
      type: "paragraph",
      text:
        "Ragi, also known as finger millet, has been consumed in India for centuries as a nourishing grain. In Himalayan and rural communities, it is valued for its ability to provide long-lasting energy and natural nutrition. Rich in calcium, fiber, and minerals, ragi is now gaining popularity as a healthy alternative to refined grains.",
    },
    {
      type: "benefits",
      title: "Benefits of Ragi Millets",
      items: [
        {
          title: "Rich in Calcium",
          description:
            "Supports strong bones and teeth.",
        },
        {
          title: "High in Fiber",
          description:
            "Helps maintain digestive health and fullness.",
        },
        {
          title: "Natural Energy Source",
          description:
            "Provides sustained energy throughout the day.",
        },
      ],
    },
    {
      type: "section",
      title: "Frequently Asked Questions (FAQs)",
      paragraphs: [],
      list: [
        "What is ragi? Ragi is also called finger millet.",
        "Is ragi healthy? Yes, it is rich in calcium and fiber.",
        "Can ragi replace wheat? Many people use it as a healthier alternative.",
        "How can ragi be consumed? It can be used in rotis, porridge, and baked foods.",
      ],
       image: {
        src: "/product_images/ragi/ragi2.webp",
        alt: "Traditional Ragi Millet from Uttarakhand",
      },
    },
  ],
}
  ,
  {
  id: 5,
  title: "Raw Himalayan Honey: Nature’s Purest Sweetener from the Hills",
  slug: "pahadi-honey-benefits",
  date: "May 2, 2026",
  publishedAt: "2026-05-02T00:00:00.000Z",
  excerpt:
    "Discover raw Himalayan honey collected from forest hives, rich in flavor, nutrients, and untouched purity.",
  image: "/product_images/pahadi_honey/pahadi_honey.webp",
  imageAlt: "Raw Himalayan forest honey in a jar",
  metaTitle: "Himalayan Raw Honey Benefits, Uses & Purity | Simdi",
  metaDescription:
    "Explore the benefits of raw Himalayan honey, how it differs from processed honey, and why it is considered nature’s purest sweetener.",
  keywords: [
    "Himalayan honey",
    "raw honey benefits",
    "pahadi honey",
    "natural sweetener",
    "forest honey India",
  ],
  productHref: "/products/pahadi-shahad",
  productCta: "Shop Raw Honey",
  fullContent: [
    {
      type: "paragraph",
      text:
        "In the untouched forests of Uttarakhand, where wildflowers bloom across the hills, bees quietly produce one of nature’s most perfect foods — raw Himalayan honey. Unlike commercial honey found in supermarkets, this honey is collected from natural hives and remains unprocessed, preserving its nutrients, enzymes, and rich floral aroma. For generations, pahadi communities have used it not just as a sweetener, but as a natural remedy and daily nourishment.",
    },

    {
      type: "image",
      src: "/product_images/pahadi_honey/pahadi_honey2.webp",
      alt: "Wild bees collecting nectar in Himalayan forests",
    },

    {
      type: "section",
      title: "What Makes Himalayan Honey Different?",
      paragraphs: [
        "Himalayan honey stands apart because it is raw and minimally handled. It is not heated or filtered heavily, which means it retains pollen, enzymes, and antioxidants that are often lost in processed honey.",
        "The flavor of this honey depends on the forest it comes from — wildflowers, herbs, and mountain flora all contribute to its unique taste and color. Every batch can vary slightly, making it truly natural and seasonal.",
      ],
      list: [
        "Collected from wild forest hives",
        "Unprocessed and chemical-free",
        "Rich in natural enzymes and pollen",
        "Distinct flavor based on floral source",
      ],
      image: {
        src: "/product_images/pahadi_honey/honey3.webp",
        alt: "Raw honey being extracted traditionally",
      },
    },

    {
      type: "section",
      title: "Why Raw Honey is Better Than Processed Honey",
      paragraphs: [
        "Most commercial honey is pasteurized at high temperatures to improve shelf life and appearance. However, this process removes beneficial nutrients and reduces its natural potency.",
        "Raw Himalayan honey, on the other hand, is kept as close to its natural state as possible. It may crystallize over time, which is a sign of purity, not spoilage.",
      ],
      list: [
        "No artificial processing or heating",
        "Retains natural nutrients",
        "Thicker and richer texture",
        "Crystallization indicates purity",
      ],
    },

    {
      type: "benefits",
      title: "Health Benefits of Himalayan Honey",
      items: [
        {
          title: "Natural Energy Source",
          description:
            "Provides quick energy without the crash associated with refined sugar.",
        },
        {
          title: "Supports Immunity",
          description:
            "Contains antioxidants and natural compounds that help strengthen the immune system.",
        },
        {
          title: "Soothes Throat",
          description:
            "Traditionally used to relieve cough and throat irritation.",
        },
        {
          title: "Digestive Aid",
          description:
            "Helps support gut health when consumed regularly in small amounts.",
        },
      ],
    },

    {
      type: "section",
      title: "How to Use Himalayan Honey in Daily Life",
      paragraphs: [
        "Himalayan honey is versatile and can be used in many ways beyond just sweetening tea. Its rich flavor pairs well with both traditional and modern recipes.",
        "From warm water in the morning to desserts and herbal drinks, it easily becomes a part of a healthy lifestyle.",
      ],
      list: [
        "Add to warm water with lemon in the morning",
        "Use as a natural sweetener in tea or milk",
        "Drizzle over fruits or desserts",
        "Mix with herbal remedies for cough relief",
      ],
    },

    {
      type: "section",
      title: "Frequently Asked Questions (FAQs)",
      paragraphs: [],
      list: [
        "Is Himalayan honey better than regular honey? Yes, because it is raw and retains natural nutrients.",
        "Does raw honey expire? Pure honey does not spoil if stored properly.",
        "Why does honey crystallize? Crystallization is a natural process and indicates purity.",
        "Can I consume honey daily? Yes, in moderate amounts as part of a balanced diet.",
      ],
    },
  ],
},
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
