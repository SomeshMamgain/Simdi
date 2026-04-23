'use client'

import { useState } from 'react'
import { Star, Leaf, Heart, ShoppingCart, CheckCircle2, Droplets } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function BuranshSuperblog() {
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  const content = {
    en: {
      tag: 'HIMALAYAN WELLNESS GUIDE',
      title: 'The Crimson Flower of the Hills: Why Buransh is Uttarakhand\'s Most Powerful Wild Drink',
      intro:
        "Every spring, when the snow retreats and the Himalayan forests of Uttarakhand burst into flame-red colour, a single flower announces the season — Buransh (Rhododendron arboreum). For centuries, the hill people of Kumaon and Garhwal have pressed its petals into a deep ruby drink that cools the body, heals the liver, and tastes like the mountains themselves. At Simdi, we bottle this wild, seasonal nectar — hand-harvested from the forests of Pauri Garhwal — so you can drink it wherever you are.",
      sec1Title: '1. What is Buransh? The Red Flower with a Thousand Uses',
      sec1Text:
        "Buransh is the common name for Rhododendron arboreum — Uttarakhand's state tree and one of the most recognisable sights in the Himalayan forests between 4,000 and 8,000 feet. Its vivid crimson flowers bloom from February to April, carpeting the hillsides in red just as the cold begins to ease. The flowers are harvested by the women of mountain villages who have been making Buransh squash, chutney, and sharbat for generations. The petals are fleshy, deeply pigmented, and sweet-tart — unlike anything you'll find in a supermarket. Because Buransh cannot be commercially farmed, every bottle of Buransh sharbat or squash you receive has been made in small, careful batches the traditional way.",
      sec2Title: '2. The Science of Buransh: Ancient Drink, Modern Research',
      sec2Text:
        "Buransh has been used in Ayurvedic and folk medicine for hundreds of years. Modern laboratory research is now confirming what local communities always knew. The flower is rich in:\n\n • Quercetin & Rutin: Flavonoids with strong anti-inflammatory, anti-ulcer, and anti-microbial properties.\n • Phenolic compounds & Saponins: Powerful antioxidants that protect cells from oxidative damage.\n • Vitamin C & Organic Acids: Natural immunity support and a refreshing sour note.\n • Ursolic Acid (in leaves): Studied for anti-tumour, anti-viral, and anti-microbial properties.\n\nAt Simdi, our Buransh sharbat is prepared without artificial preservatives or heat treatment — so the bioactive compounds stay intact from the hillside to your glass.",
      benefitTitle: 'Health Benefits of Buransh Sharbat',
      benefits: [
        { t: 'Liver Detox & Cleanse', d: 'Flavonoids and phenolic compounds in Buransh support the liver\'s natural detoxification and protect it from damage.' },
        { t: 'Heart Health', d: 'Antioxidants and flavonoids help improve blood circulation and may help lower bad cholesterol over time.' },
        { t: 'Natural Summer Cooler', d: 'Buransh sharbat has a natural cooling effect on the body — the traditional summer drink of the Himalayan hills.' },
        { t: 'Immunity Booster', d: 'High Vitamin C, quercetin, and rutin work together to strengthen the immune system and fight seasonal infections.' },
        { t: 'Anti-Inflammatory', d: 'Quercetin and rutin reduce internal inflammation linked to arthritis, gout, and chronic disease.' },
        { t: 'Blood Sugar Support', d: 'Research suggests rhododendron compounds may help inhibit glucose enzymes, supporting natural blood sugar management.' },
      ],
      ctaTitle: 'Drink the Himalayas This Summer',
      ctaBtn: 'Shop Buransh Sharbat',
      ctaSub: 'Wild-harvested from Pauri Garhwal. Limited spring season. No preservatives. No artificiality. Just the mountains in a bottle.',
    },
    hi: {
      tag: 'हिमालयन स्वास्थ्य मार्गदर्शिका',
      title: 'पहाड़ों का लाल फूल: बुरांश — उत्तराखंड का सबसे ताकतवर जंगली पेय',
      intro:
        "हर वसंत में, जब उत्तराखंड के हिमालयी जंगलों में बर्फ पिघलती है और जंगल लाल रंग में रंग जाते हैं — एक फूल इस मौसम का ऐलान करता है: बुरांश (Rhododendron arboreum)। सदियों से कुमाऊं और गढ़वाल के पहाड़ी लोग इसकी पंखुड़ियों से एक गहरा माणिक-लाल पेय बनाते आए हैं जो शरीर को ठंडक देता है, लिवर को साफ करता है और पहाड़ों का स्वाद लेकर आता है। सिमड़ी में, हम इस जंगली, मौसमी रस को — पौड़ी गढ़वाल के जंगलों से हाथ से तोड़कर — आपके घर तक पहुंचाते हैं।",
      sec1Title: '1. बुरांश क्या है? एक हज़ार उपयोग वाला लाल फूल',
      sec1Text:
        "बुरांश उत्तराखंड के राज्य वृक्ष Rhododendron arboreum का लोकप्रिय नाम है — जो हिमालयी जंगलों में 4,000 से 8,000 फीट की ऊंचाई पर मिलता है। इसके चमकीले लाल फूल फरवरी से अप्रैल के बीच खिलते हैं, ठीक तब जब ठंड कम होने लगती है। पहाड़ी गांवों की महिलाएं इन फूलों को तोड़कर बुरांश शरबत, चटनी और स्क्वैश बनाती हैं — जैसा उनकी पीढ़ियां पहले से करती आई हैं। फूल की पंखुड़ियां गूदेदार, गहरे रंग की और मीठी-खट्टी होती हैं — सुपरमार्केट में कुछ भी इससे तुलना नहीं करता। चूंकि बुरांश की व्यावसायिक खेती नहीं होती, इसलिए हर बोतल परंपरागत तरीके से छोटे, सावधान बैच में बनाई जाती है।",
      sec2Title: '2. बुरांश का विज्ञान: प्राचीन पेय, आधुनिक शोध',
      sec2Text:
        "बुरांश का उपयोग सदियों से आयुर्वेद और लोक चिकित्सा में होता आया है। आधुनिक प्रयोगशाला अनुसंधान अब उसे साबित कर रही है जो स्थानीय समुदाय हमेशा से जानते थे। फूल में ये तत्व होते हैं:\n\n • क्वेरसेटिन और रुटिन: मजबूत एंटी-इंफ्लेमेटरी, एंटी-अल्सर और एंटी-माइक्रोबियल गुणों वाले फ्लेवोनॉइड।\n • फेनोलिक यौगिक और सैपोनिन: शक्तिशाली एंटीऑक्सिडेंट जो कोशिकाओं को ऑक्सीडेटिव क्षति से बचाते हैं।\n • विटामिन C और ऑर्गेनिक एसिड: प्राकृतिक रोग प्रतिरोधक क्षमता का समर्थन।\n • उर्सोलिक एसिड (पत्तियों में): एंटी-ट्यूमर, एंटी-वायरल और एंटी-माइक्रोबियल गुणों के लिए अध्ययन किया गया।\n\nसिमड़ी में, हमारा बुरांश शरबत बिना कृत्रिम परिरक्षकों या हीट ट्रीटमेंट के तैयार किया जाता है — ताकि बायोएक्टिव यौगिक पहाड़ से आपके गिलास तक बरकरार रहें।",
      benefitTitle: 'बुरांश शरबत के स्वास्थ्य लाभ',
      benefits: [
        { t: 'लिवर डिटॉक्स और सफाई', d: 'बुरांश में फ्लेवोनॉइड और फेनोलिक यौगिक लिवर की प्राकृतिक डिटॉक्सिफिकेशन को सपोर्ट करते हैं और नुकसान से बचाते हैं।' },
        { t: 'हृदय स्वास्थ्य', d: 'एंटीऑक्सिडेंट और फ्लेवोनॉइड रक्त परिसंचरण में सुधार और खराब कोलेस्ट्रॉल कम करने में मदद करते हैं।' },
        { t: 'प्राकृतिक गर्मी का कूलर', d: 'बुरांश शरबत का शरीर पर प्राकृतिक शीतल प्रभाव होता है — हिमालयी पहाड़ियों का पारंपरिक गर्मी का पेय।' },
        { t: 'रोग प्रतिरोधक क्षमता बूस्टर', d: 'उच्च विटामिन C, क्वेरसेटिन, और रुटिन मिलकर प्रतिरक्षा प्रणाली को मजबूत करते हैं और मौसमी संक्रमण से लड़ते हैं।' },
        { t: 'एंटी-इंफ्लेमेटरी', d: 'क्वेरसेटिन और रुटिन गठिया, जोड़ों के दर्द और पुरानी बीमारियों से जुड़ी आंतरिक सूजन को कम करते हैं।' },
        { t: 'ब्लड शुगर सपोर्ट', d: 'शोध बताते हैं कि रोडोडेंड्रॉन के यौगिक ग्लूकोज एंजाइम को नियंत्रित करने में मदद कर सकते हैं।' },
      ],
      ctaTitle: 'इस गर्मी में पिएं हिमालय का स्वाद',
      ctaBtn: 'बुरांश शरबत खरीदें',
      ctaSub: 'पौड़ी गढ़वाल से जंगली-तोड़ा गया। सीमित वसंत मौसम। कोई परिरक्षक नहीं। कोई कृत्रिमता नहीं। बस एक बोतल में पहाड़।',
    },
  }

  const t = content[lang]

  return (
    <div className="site-page-shell site-page-shell--hidden-overflow">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 20px 80px' }}>

        {/* Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ background: '#E8E4D9', padding: '4px', borderRadius: '50px', display: 'flex', border: '1px solid #D1CDC0' }}>
            {(['en', 'hi'] as const).map((language) => (
              <button
                key={language}
                onClick={() => setLang(language)}
                style={{
                  background: lang === language ? '#1E2D24' : 'transparent',
                  color: lang === language ? '#fff' : '#1E2D24',
                  border: 'none',
                  padding: '10px 30px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                }}
              >
                {language === 'en' ? 'English' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Header */}
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#B58E58', fontWeight: 800, letterSpacing: '0.3em', fontSize: '0.75rem' }}>{t.tag}</span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1E2D24', marginTop: '20px', lineHeight: 1.1, fontWeight: 700 }}>
            {t.title}
          </h1>
        </header>

        {/* Intro + Hero Image */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ flex: '1 1 450px' }}>
            <p style={{ fontSize: '1.25rem', color: '#5E6E5E', fontStyle: 'italic', borderLeft: '5px solid #B58E58', paddingLeft: '25px', lineHeight: 1.8 }}>
              {t.intro}
            </p>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            {/* Replace with your actual Buransh image path */}
            <img src="/product_images/buransh/buransh.webp" alt="Wild Buransh rhododendron flowers from the forests of Pauri Garhwal" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>

        {/* Section 1 */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '50px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              {/* Replace with your actual Buransh harvest image */}
              <img src="/product_images/buransh/buransh2.webp" alt="Women hand-harvesting Buransh flowers in Uttarakhand" style={{ width: '100%', borderRadius: '30px' }} />
            </div>
            <div style={{ flex: '1 1 500px' }}>
              <h2 style={{ fontFamily: 'Georgia', fontSize: '2.5rem', color: '#1E2D24', marginBottom: '25px' }}>{t.sec1Title}</h2>
              <p style={{ color: '#5E6E5E', lineHeight: 1.9, fontSize: '1.1rem' }}>{t.sec1Text}</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: '100px' }}>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '2.5rem', color: '#1E2D24', marginBottom: '30px', textAlign: 'center' }}>{t.sec2Title}</h2>
          <div style={{ whiteSpace: 'pre-line', color: '#5E6E5E', lineHeight: 2, fontSize: '1.1rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            {t.sec2Text}
          </div>
        </section>

        {/* Benefits Grid */}
        <section style={{ padding: '60px', background: '#fff', borderRadius: '40px', border: '1px solid #E8E4D9', marginBottom: '100px' }}>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '2.2rem', color: '#1E2D24', textAlign: 'center', marginBottom: '50px' }}>{t.benefitTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {t.benefits.map((benefit, index) => (
              <div key={index} style={{ display: 'flex', gap: '15px' }}>
                <CheckCircle2 color="#B58E58" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 5px', color: '#1E2D24', fontWeight: 700 }}>{benefit.t}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#5E6E5E', lineHeight: 1.5 }}>{benefit.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: '#1E2D24', padding: '70px 40px', borderRadius: '40px', color: '#fff', textAlign: 'center' }}>
          <Droplets size={48} color="#B58E58" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '2.2rem', marginBottom: '15px', fontFamily: 'Georgia' }}>{t.ctaTitle}</h3>
          <p style={{ color: '#A3B3A3', marginBottom: '35px', maxWidth: '650px', margin: '0 auto 35px', fontSize: '1.1rem' }}>{t.ctaSub}</p>
          <Link href="https://www.simdi.in/products/pahadi-blossom-juice" style={{ background: '#B58E58', color: '#fff', padding: '20px 50px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '12px', letterSpacing: '0.1em' }}>
            <ShoppingCart size={22} /> {t.ctaBtn}
          </Link>
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px', color: '#A3B3A3', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Heart size={14} fill="#B58E58" color="#B58E58" /> Wild Harvested</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14} fill="#B58E58" color="#B58E58" /> Spring Season Only</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Leaf size={14} fill="#B58E58" color="#B58E58" /> No Preservatives</span>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
