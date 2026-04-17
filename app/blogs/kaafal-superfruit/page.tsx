'use client'

import { useState } from 'react'
import { Star, Leaf, Heart, ShoppingCart, CheckCircle2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function KaafalSuperfruit() {
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  const content = {
    en: {
      tag: 'HIMALAYAN WELLNESS GUIDE',
      title: 'The Forest Berry of the Gods: Why Kaafal is the Himalayan Superfruit You Need',
      intro:
        "Hidden deep in the oak and rhododendron forests of Uttarakhand, a wild berry ripens every spring that the hill folk have eaten for centuries — not just as a fruit, but as medicine, ritual, and memory. Kaafal (Myrica esculenta) is a tangy, ruby-red jewel that grows between 4,000 and 8,000 feet above sea level, untouched by farming, fertilisers, or human intervention. At Simdi, we hand-harvest this ancient treasure from the forests of Pauri Garhwal and bring it to your doorstep.",
      sec1Title: '1. What is Kaafal? The Wild Berry with Ancient Roots',
      sec1Text:
        "Kaafal is the Himalayan bayberry — known as Myrica esculenta in botanical texts and sung about in the folk songs of Kumaon and Garhwal for hundreds of years. It is a wild, uncultivated shrub that fruits just once a year, between March and May, when the snow melts and the hillsides turn warm. The berries are small, deeply pigmented, and intensely flavoured — a burst of sweet-sour taste that locals call 'the taste of the hills'. Because Kaafal grows only in wild forests and cannot be commercially farmed, every berry you taste has been handpicked by the women of mountain villages, just as their grandmothers did before them.",
      sec2Title: '2. The Science Behind the Superfruit: Why Kaafal is More Than Just Tasty',
      sec2Text:
        "Modern research is only now catching up to what Pahadi families have always known. Kaafal is extraordinarily rich in natural bioactives: \n\n • Myricetin: A powerful flavonoid with anti-inflammatory and anti-cancer properties. \n • Anthocyanins: The deep pigments that protect cells from oxidative stress and slow ageing. \n • Vitamin C: Wild Kaafal has significantly higher Vitamin C than cultivated fruits. \n • Gallic Acid & Quercetin: Compounds studied for immune support, antidiabetic effects, and heart health. \n\n At Simdi, we process Kaafal minimally — no artificial heat, no preservatives — to ensure every bottle of Kaafal Sharbat or packet of dried Kaafal retains the full potency of the wild fruit.",
      benefitTitle: 'Traditional & Modern Benefits of Kaafal',
      benefits: [
        { t: 'Rich in Antioxidants', d: 'Anthocyanins and myricetin fight free radicals, slow ageing, and protect cells.' },
        { t: 'Immunity Booster', d: 'Exceptionally high natural Vitamin C and quercetin support a strong immune system.' },
        { t: 'Anti-Inflammatory', d: 'Gallic acid compounds reduce internal inflammation linked to chronic disease.' },
        { t: 'Heart & Liver Health', d: 'Traditional Ayurvedic use for improving liver function and supporting a healthy heart.' },
        { t: 'Digestive Aid', d: 'The natural tartness and fibre in Kaafal aid gut motility and healthy digestion.' },
        { t: 'Wild & Chemical-Free', d: 'Grows in pristine Himalayan forests — zero pesticides, zero fertilisers, ever.' },
      ],
      ctaTitle: 'Taste the Wild Forests of Pauri Garhwal',
      ctaBtn: 'Shop Kaafal Here',
      ctaSub: 'Hand-harvested every spring from ancient forest trails. Limited season. Unlimited goodness.',
    },
    hi: {
      tag: 'हिमालयन स्वास्थ्य मार्गदर्शिका',
      title: 'देवों का जंगली फल: काफल — वह हिमालयी सुपरफ्रूट जो आपको जरूर चाहिए',
      intro:
        "उत्तराखंड के बुरांश और बांज के घने जंगलों में हर वसंत में एक जंगली बेरी पकती है जिसे पहाड़ी लोग सदियों से न केवल फल के रूप में बल्कि औषधि, परंपरा और यादों के रूप में खाते आए हैं। काफल (Myrica esculenta) एक खट्टी-मीठी, लाल रंग की वन-संपदा है जो समुद्र तल से 4,000 से 8,000 फीट की ऊंचाई पर उगती है — बिना किसी खेती, खाद या मानवीय हस्तक्षेप के। सिमड़ी में, हम इस प्राचीन खजाने को पौड़ी गढ़वाल के जंगलों से हाथ से तोड़कर आपके घर तक पहुंचाते हैं।",
      sec1Title: '1. काफल क्या है? जड़ों से जुड़ा एक जंगली फल',
      sec1Text:
        "काफल हिमालय की जंगली बेरी है — वनस्पति विज्ञान में इसे Myrica esculenta कहते हैं और कुमाऊं-गढ़वाल के लोकगीतों में सैकड़ों साल से इसका जिक्र होता आया है। यह एक जंगली, अनखेती झाड़ी है जो साल में केवल एक बार, मार्च से मई के बीच — जब बर्फ पिघलती है और पहाड़ियां गर्म होती हैं — फल देती है। बेरियां छोटी, गहरे रंग की और तीव्र स्वाद वाली होती हैं — मीठा-खट्टा वह स्वाद जिसे स्थानीय लोग 'पहाड़ों का स्वाद' कहते हैं। चूंकि काफल केवल जंगलों में उगता है और इसकी व्यावसायिक खेती नहीं होती, इसलिए हर बेरी पहाड़ी गांवों की महिलाओं के हाथों से तोड़ी जाती है — ठीक वैसे जैसे उनकी दादी-नानी करती थीं।",
      sec2Title: '2. सुपरफ्रूट का विज्ञान: काफल सिर्फ स्वादिष्ट नहीं, चमत्कारी भी है',
      sec2Text:
        "आधुनिक विज्ञान अब उस बात को साबित कर रहा है जो पहाड़ी परिवार हमेशा से जानते थे। काफल प्राकृतिक जैव-सक्रिय तत्वों से भरपूर है: \n\n • मिरिसेटिन: एक शक्तिशाली फ्लेवोनॉइड जिसमें एंटी-इंफ्लेमेटरी और कैंसर-रोधी गुण हैं। \n • एंथोसायनिन: वह गहरा रंगद्रव्य जो कोशिकाओं को ऑक्सीडेटिव तनाव से बचाता है और बुढ़ापा धीमा करता है। \n • विटामिन C: जंगली काफल में खेती के फलों की तुलना में विटामिन C काफी अधिक होता है। \n • गैलिक एसिड और क्वेरसेटिन: ऐसे यौगिक जो प्रतिरक्षा, मधुमेह-नियंत्रण और हृदय स्वास्थ्य के लिए अध्ययन किए जा रहे हैं। \n\n सिमड़ी में, हम काफल को न्यूनतम प्रसंस्करण के साथ तैयार करते हैं — कोई कृत्रिम गर्मी नहीं, कोई परिरक्षक नहीं — ताकि हर बोतल काफल शरबत या सूखे काफल के पैकेट में इस जंगली फल की पूरी ताकत बनी रहे।",
      benefitTitle: 'काफल के पारंपरिक और आधुनिक लाभ',
      benefits: [
        { t: 'एंटीऑक्सिडेंट से भरपूर', d: 'एंथोसायनिन और मिरिसेटिन मुक्त कणों से लड़ते हैं, बुढ़ापा धीमा करते हैं और कोशिकाओं की रक्षा करते हैं।' },
        { t: 'रोग प्रतिरोधक क्षमता', d: 'असाधारण रूप से उच्च प्राकृतिक विटामिन C और क्वेरसेटिन मजबूत प्रतिरक्षा प्रणाली बनाते हैं।' },
        { t: 'एंटी-इंफ्लेमेटरी', d: 'गैलिक एसिड यौगिक पुरानी बीमारियों से जुड़ी आंतरिक सूजन को कम करते हैं।' },
        { t: 'हृदय और यकृत स्वास्थ्य', d: 'यकृत की कार्यक्षमता सुधारने और हृदय को स्वस्थ रखने के लिए पारंपरिक आयुर्वेदिक उपयोग।' },
        { t: 'पाचन सहायक', d: 'काफल की प्राकृतिक खटास और फाइबर आंतों की गतिशीलता और स्वस्थ पाचन में मदद करते हैं।' },
        { t: 'जंगली और रसायन-मुक्त', d: 'शुद्ध हिमालयी जंगलों में उगता है — कभी कोई कीटनाशक नहीं, कभी कोई उर्वरक नहीं।' },
      ],
      ctaTitle: 'पौड़ी गढ़वाल के जंगलों का स्वाद लें',
      ctaBtn: 'जंगली काफल खरीदें',
      ctaSub: 'हर वसंत में प्राचीन वन पगडंडियों से हाथ से तोड़ा गया। सीमित मौसम। असीमित अच्छाई।',
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
            <img src="/kaafal.webp" alt="Wild Kaafal berries from the forests of Pauri Garhwal" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>

        {/* Section 1 */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '50px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <img src="/kaafal3.webp" alt="Hand-harvesting wild Kaafal in the Himalayan forests" style={{ width: '100%', borderRadius: '30px' }} />
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
          <MapPin size={48} color="#B58E58" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '2.2rem', marginBottom: '15px', fontFamily: 'Georgia' }}>{t.ctaTitle}</h3>
          <p style={{ color: '#A3B3A3', marginBottom: '35px', maxWidth: '650px', margin: '0 auto 35px', fontSize: '1.1rem' }}>{t.ctaSub}</p>
          <Link href="/products/kaafal-indian-bayberry" style={{ background: '#B58E58', color: '#fff', padding: '20px 50px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '12px', letterSpacing: '0.1em' }}>
            <ShoppingCart size={22} /> {t.ctaBtn}
          </Link>
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px', color: '#A3B3A3', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Heart size={14} fill="#B58E58" color="#B58E58" /> Wild Harvested</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14} fill="#B58E58" color="#B58E58" /> Seasonal & Rare</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Leaf size={14} fill="#B58E58" color="#B58E58" /> Chemical Free</span>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}