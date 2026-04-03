'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Star, Leaf, Heart, ShoppingCart, CheckCircle2, MapPin } from 'lucide-react'

export default function CowGheeBlog() {
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  const content = {
    en: {
      tag: "HIMALAYAN WELLNESS GUIDE",
      title: "The Golden Elixir: Why A2 Badri Cow Ghee is the Ultimate Superfood",
      intro: "Deep in the high-altitude pastures of Pauri Garhwal, a small, hardy herbivore known as the Badri cow grazes on medicinal herbs and mineral-rich grass. The milk they produce is rare, and the ghee? It's literally liquid gold. In this guide, we dive deep into why this ancient Himalayan treasure is making waves in modern nutrition.",
      
      sec1Title: "1. The Legend of the Badri Cow",
      sec1Text: "The Badri cow is native to the Himalayas. Unlike jersey cows, these are small, agile, and only eat natural vegetation. Because they graze 8,000 feet above sea level, their milk contains high concentrations of medicinal properties from herbs like 'Jangli Tulsi' and 'Brahmi'. This makes the Ghee naturally rich in A2 protein, which is easier on the gut and highly anti-inflammatory.",
      
      sec2Title: "2. The 'Bilona' Difference: Why it Matters",
      sec2Text: "Most commercial brands use cream-separation machines and high heat, which kills the vital nutrients. At Simdi, we follow the 3000-year-old 'Bilona' process: \n\n • The milk is curdled into whole yogurt. \n • The yogurt is churned with a wooden whisker (Bilona) to get Makkhan. \n • The Makkhan is slow-cooked on a traditional wood fire (Chulha). \n\n This slow process preserves CLA (Conjugated Linoleic Acid) and the nutty aroma that machine-made ghee simply lacks.",
      
      benefitTitle: "Traditional Benefits of Badri Ghee",
      benefits: [
        { t: "Gut Health", d: "High in Butyric Acid that heals the intestinal lining." },
        { t: "Brain Power", d: "Essential fats that improve memory and cognitive function." },
        { t: "Joint Lubrication", d: "Natural lubricant that reduces stiffness and inflammation." },
        { t: "High Smoke Point", d: "Perfect for Indian cooking as it doesn't break into toxins at high heat." }
      ],
      ctaTitle: "Experience Purity from Pauri Garhwal",
      ctaBtn: "Shop Authentic Bilona Ghee",
      ctaSub: "Handcrafted in the mountains, free from city pollution, additives, and preservatives."
    },
    hi: {
      tag: "हिमालयन स्वास्थ्य मार्गदर्शिका",
      title: "सुनहरा अमृत: A2 बद्री गाय का घी सबसे बेहतरीन सुपरफूड क्यों है?",
      intro: "पौड़ी गढ़वाल के ऊंचे पहाड़ों में, 'बद्री गाय' औषधीय जड़ी-बूटियों और खनिज युक्त घास चरती है। उनका दूध दुर्लभ है, और उससे बना घी? वह असल में 'तरल सोना' है। इस लेख में हम जानेंगे कि क्यों यह प्राचीन हिमालयी खजाना आधुनिक पोषण की दुनिया में धूम मचा रहा है।",
      
      sec1Title: "1. बद्री गाय की महिमा",
      sec1Text: "बद्री गाय हिमालय की मूल नस्ल है। ये गायें छोटी और फुर्तीली होती हैं और केवल प्राकृतिक वनस्पतियां ही खाती हैं। समुद्र तल से 8,000 फीट ऊपर चरने के कारण, इनके दूध में 'जंगली तुलसी' और 'ब्राह्मी' जैसी जड़ी-बूटियों के औषधीय गुण होते हैं। यही कारण है कि यह घी A2 प्रोटीन से भरपूर होता है, जो पेट के लिए हल्का और सूजन कम करने में मददगार है।",
      
      sec2Title: "2. 'बिलोना' पद्धति का महत्व",
      sec2Text: "ज्यादातर ब्रांड क्रीम निकालने वाली मशीनों का उपयोग करते हैं, जिससे पोषक तत्व नष्ट हो जाते हैं। सिमड़ी में, हम 3000 साल पुरानी 'बिलोना' प्रक्रिया का पालन करते हैं: \n\n • दूध को दही में बदला जाता है। \n • दही को लकड़ी की मथनी (बिलोना) से मथकर मक्खन निकाला जाता है। \n • मक्खन को पारंपरिक चूल्हे पर धीमी आंच पर पकाया जाता है। \n\n यह धीमी प्रक्रिया CLA और उस असली खुशबू को सुरक्षित रखती है जो मशीनी घी में नहीं मिल सकती।",
      
      benefitTitle: "बद्री घी के आयुर्वेदिक लाभ",
      benefits: [
        { t: "पाचन में सुधार", d: "ब्यूटिरिक एसिड से भरपूर जो आंतों के स्वास्थ्य को ठीक करता है।" },
        { t: "दिमागी शक्ति", d: "स्वस्थ वसा जो याददाश्त और एकाग्रता को बढ़ाती है।" },
        { t: "जोड़ों का दर्द", d: "प्राकृतिक लुब्रिकेंट जो जोड़ों की अकड़न और सूजन को कम करता है।" },
        { t: "हाई स्मोक पॉइंट", d: "भारतीय खाना पकाने के लिए सबसे सुरक्षित क्योंकि यह तेज आंच पर खराब नहीं होता।" }
      ],
      ctaTitle: "पौड़ी गढ़वाल की शुद्धता का अनुभव करें",
      ctaBtn: "शुद्ध बिलोना घी खरीदें",
      ctaSub: "पहाड़ों में हस्तनिर्मित, शहर के प्रदूषण, मिलावट और परिरक्षकों से पूरी तरह मुक्त।"
    }
  }

  const t = content[lang];

  return (
    <div style={{ background: '#F9F7F2', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 20px 80px' }}>
        
        {/* --- LANGUAGE TOGGLE (TOP) --- */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ background: '#E8E4D9', padding: '4px', borderRadius: '50px', display: 'flex', border: '1px solid #D1CDC0' }}>
            {['en', 'hi'].map((l) => (
              <button 
                key={l}
                onClick={() => setLang(l as 'en' | 'hi')}
                style={{
                  background: lang === l ? '#1E2D24' : 'transparent',
                  color: lang === l ? '#fff' : '#1E2D24',
                  border: 'none', padding: '10px 30px', borderRadius: '50px', 
                  cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem'
                }}>{l === 'en' ? 'English' : 'हिन्दी'}</button>
            ))}
          </div>
        </div>

        {/* --- HEADER --- */}
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#B58E58', fontWeight: 800, letterSpacing: '0.3em', fontSize: '0.75rem' }}>{t.tag}</span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1E2D24', marginTop: '20px', lineHeight: 1.1, fontWeight: 700 }}>{t.title}</h1>
        </header>

        {/* --- INTRO SECTION --- */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ flex: '1 1 450px' }}>
            <p style={{ fontSize: '1.25rem', color: '#5E6E5E', fontStyle: 'italic', borderLeft: '5px solid #B58E58', paddingLeft: '25px', lineHeight: 1.8 }}>
              {t.intro}
            </p>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <img src="/badricow.png" alt="Badri Cow" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>

        {/* --- SECTION 1 --- */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '50px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <img src="/badricow2.png" alt="Bilona Process" style={{ width: '100%', borderRadius: '30px' }} />
            </div>
            <div style={{ flex: '1 1 500px' }}>
              <h2 style={{ fontFamily: 'Georgia', fontSize: '2.5rem', color: '#1E2D24', marginBottom: '25px' }}>{t.sec1Title}</h2>
              <p style={{ color: '#5E6E5E', lineHeight: 1.9, fontSize: '1.1rem' }}>{t.sec1Text}</p>
            </div>
          </div>
        </section>

        {/* --- SECTION 2 --- */}
        <section style={{ marginBottom: '100px' }}>
           <h2 style={{ fontFamily: 'Georgia', fontSize: '2.5rem', color: '#1E2D24', marginBottom: '30px', textAlign: 'center' }}>{t.sec2Title}</h2>
           <div style={{ whiteSpace: 'pre-line', color: '#5E6E5E', lineHeight: 2, fontSize: '1.1rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
             {t.sec2Text}
           </div>
        </section>

        {/* --- BENEFITS GRID --- */}
        <section style={{ padding: '60px', background: '#fff', borderRadius: '40px', border: '1px solid #E8E4D9', marginBottom: '100px' }}>
           <h2 style={{ fontFamily: 'Georgia', fontSize: '2.2rem', color: '#1E2D24', textAlign: 'center', marginBottom: '50px' }}>{t.benefitTitle}</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              {t.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px' }}>
                  <CheckCircle2 className="text-[#B58E58] shrink-0" size={24} />
                  <div>
                    <h4 style={{ margin: '0 0 5px', color: '#1E2D24', fontWeight: 700 }}>{b.t}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#5E6E5E', lineHeight: 1.5 }}>{b.d}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* --- END CTA (CONVERSION) --- */}
        <div style={{ background: '#1E2D24', padding: '70px 40px', borderRadius: '40px', color: '#fff', textAlign: 'center' }}>
          <MapPin size={48} color="#B58E58" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '2.2rem', marginBottom: '15px', fontFamily: 'Georgia' }}>{t.ctaTitle}</h3>
          <p style={{ color: '#A3B3A3', marginBottom: '35px', maxWidth: '650px', marginInline: 'auto', fontSize: '1.1rem' }}>{t.ctaSub}</p>
          <Link href="/shop" style={{ background: '#B58E58', color: '#fff', padding: '20px 50px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '12px', letterSpacing: '0.1em', transition: '0.3s' }}>
            <ShoppingCart size={22} /> {t.ctaBtn}
          </Link>
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px', color: '#A3B3A3', fontSize: '0.8rem' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Heart size={14} fill="#B58E58" color="#B58E58" /> Traditional Method</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14} fill="#B58E58" color="#B58E58" /> Highly Rated</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Leaf size={14} fill="#B58E58" color="#B58E58" /> Preservative Free</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}