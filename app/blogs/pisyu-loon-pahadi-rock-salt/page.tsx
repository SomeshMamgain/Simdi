'use client'
import { useState } from 'react'
import { Star, Leaf, Heart, ShoppingCart, CheckCircle2, Droplets } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function PisyuLoonSuperblog() {
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  const content = {
    en: {
      tag: 'HIMALAYAN SUPERFOOD GUIDE',
      title: 'Pisyu Loon: The Stone-Ground Himalayan Salt That Defines Real Taste',
      intro:
        "In the villages of Uttarakhand, taste was never manufactured — it was created slowly, patiently, and with care. Pisyu Loon is one such timeless preparation. Made by grinding rock salt with herbs and spices on stone (sil-batta), it carries the true essence of the mountains. At Simdi, we bring this authentic, handcrafted pahadi blend directly to your kitchen, preserving the soul of Himalayan seasoning.",
      sec1Title: '1. What is Pisyu Loon? The Ancient Art of Flavored Salt',
      sec1Text:
        "Pisyu Loon, meaning 'ground salt', is a traditional Himalayan spice blend that is far more than just a seasoning. It is made using pure rock salt, garlic, green chillies, coriander, and local wild herbs. Unlike machine-processed salts, every grain of Pisyu Loon is crushed by hand using a 'sil-batta'. This traditional method ensures that the ingredients don't lose their natural oils or aroma through heat, resulting in a coarse, vibrant texture that machine grinding simply cannot replicate.",
      sec2Title: '2. The Science of Stone-Grinding: Flavor Meets Nutrition',
      sec2Text:
        "Beyond the incredible taste, the traditional method of preparing Pisyu Loon offers several health benefits that modern processing lacks. This blend is rich in:\n\n • Natural Trace Minerals: Derived from Himalayan rock salt, providing essential electrolytes.\n • Essential Oils: Stone-grinding releases natural oils from garlic and herbs without burning them.\n • Digestive Enzymes: Raw ingredients like coriander and local herbs support gut health.\n • Zero Additives: Free from anti-caking agents or artificial iodine found in table salt.\n\nAt Simdi, our Pisyu Loon is prepared in small batches by local women, ensuring that the authentic village taste and nutritional integrity remain intact.",
      benefitTitle: 'Health Benefits of Pisyu Loon',
      benefits: [
        { t: 'Supports Digestion', d: 'The inclusion of traditional herbs and raw garlic helps stimulate digestive enzymes and reduce bloating.' },
        { t: 'Rich in Trace Minerals', d: 'Unlike refined salt, Himalayan rock salt contains over 80 trace minerals essential for body functions.' },
        { t: 'Natural Immunity', d: 'Freshly crushed garlic and green chillies provide a natural boost of Vitamin C and antimicrobial properties.' },
        { t: 'Healthy Electrolytes', d: 'Helps maintain the body’s pH balance and hydration levels through unrefined, natural minerals.' },
        { t: 'Anti-Inflammatory', d: 'Coriander and mountain herbs contain antioxidants that help reduce internal inflammation.' },
        { t: 'Low Sodium Alternative', d: 'Because the flavor is so intense, you naturally use less salt, helping manage daily sodium intake.' },
      ],
      ctaTitle: 'Bring the Himalayas to Your Table',
      ctaBtn: 'Shop Pisyu Loon',
      ctaSub: 'Hand-ground on sil-batta. 100% natural ingredients. No preservatives. No machines. Just the authentic taste of Uttarakhand.',
    },
    hi: {
      tag: 'हिमालयन सुपरफूड मार्गदर्शिका',
      title: 'पिस्यू लून: असली स्वाद देने वाला पहाड़ी नमक, जो पत्थर पर पीसा गया है',
      intro:
        "उत्तराखंड के गांवों में स्वाद मशीनों से नहीं, बल्कि मेहनत और परंपरा से बनता है। पिस्यू लून उसी कालजयी परंपरा का हिस्सा है। सेंधा नमक को जड़ी-बूटियों और मसालों के साथ सिल-बट्टे पर पीसकर तैयार किया गया यह नमक पहाड़ों का असली सार लेकर आता है। सिमड़ी में, हम इस पारंपरिक पहाड़ी नमक को सीधे आपके घर तक लाते हैं, ताकि आप हिमालयी स्वाद का आनंद ले सकें।",
      sec1Title: '1. पिस्यू लून क्या है? सुगंधित नमक की प्राचीन कला',
      sec1Text:
        "पिस्यू लून का अर्थ है 'पिसा हुआ नमक'। यह एक पारंपरिक पहाड़ी मसाला मिश्रण है जो केवल एक नमक नहीं है। इसे सेंधा नमक, लहसुन, हरी मिर्च, धनिया और स्थानीय जंगली जड़ी-बूटियों का उपयोग करके बनाया जाता है। मशीनी नमक के विपरीत, पिस्यू लून के हर दाने को सिल-बट्टे पर हाथ से पीसा जाता है। यह तरीका यह सुनिश्चित करता है कि मसालों का प्राकृतिक तेल और सुगंध बरकरार रहे, जो आपको किसी भी सुपरमार्केट ब्रांड में नहीं मिलेगा।",
      sec2Title: '2. पत्थर पर पीसने का विज्ञान: स्वाद और पोषण का संगम',
      sec2Text:
        "बेहतरीन स्वाद के अलावा, पिस्यू लून तैयार करने की पारंपरिक विधि कई स्वास्थ्य लाभ प्रदान करती है। इस मिश्रण में शामिल हैं:\n\n • प्राकृतिक खनिज: हिमालयी सेंधा नमक से प्राप्त, जो शरीर के लिए आवश्यक इलेक्ट्रोलाइट्स प्रदान करता है।\n • आवश्यक तेल: पत्थर पर पीसने से लहसुन और जड़ी-बूटियों का तेल बिना जले बाहर निकलता है।\n • पाचन एंजाइम: धनिया और स्थानीय जड़ी-बूटियाँ आंतों के स्वास्थ्य का समर्थन करती हैं।\n • शून्य मिलावट: टेबल सॉल्ट में पाए जाने वाले एंटी-केकिंग एजेंट या कृत्रिम आयोडीन से मुक्त।\n\nसिमड़ी में, हमारा पिस्यू लून स्थानीय महिलाओं द्वारा छोटे बैचों में तैयार किया जाता है, ताकि असली पहाड़ी स्वाद आपके पास पहुंचे।",
      benefitTitle: 'पिस्यू लून के स्वास्थ्य लाभ',
      benefits: [
        { t: 'पाचन में सहायक', d: 'पारंपरिक जड़ी-बूटियों और कच्चे लहसुन का समावेश पाचन एंजाइमों को उत्तेजित करने में मदद करता है।' },
        { t: 'खनिजों से भरपूर', d: 'परिष्कृत नमक के विपरीत, इसमें शरीर के कार्यों के लिए आवश्यक 80 से अधिक सूक्ष्म खनिज होते हैं।' },
        { t: 'प्राकृतिक प्रतिरक्षा', d: 'ताजा कुचला हुआ लहसुन और हरी मिर्च विटामिन C और रोगाणुरोधी गुणों का प्राकृतिक स्रोत हैं।' },
        { t: 'स्वस्थ इलेक्ट्रोलाइट्स', d: 'अपिरष्कृत खनिजों के माध्यम से शरीर के pH संतुलन और हाइड्रेशन स्तर को बनाए रखने में मदद करता है।' },
        { t: 'एंटी-इंफ्लेमेटरी', d: 'धनिया और पहाड़ी जड़ी-बूटियों में एंटीऑक्सिडेंट होते हैं जो आंतरिक सूजन को कम करने में मदद करते हैं।' },
        { t: 'कम सोडियम विकल्प', d: 'स्वाद इतना तीव्र होने के कारण, आप स्वाभाविक रूप से नमक का कम उपयोग करते हैं, जो स्वास्थ्य के लिए बेहतर है।' },
      ],
      ctaTitle: 'इस वसंत, हिमालय का स्वाद अपने घर लाएं',
      ctaBtn: 'पिस्यू लून खरीदें',
      ctaSub: 'सिल-बट्टे पर हाथ से पीसा गया। 100% प्राकृतिक। कोई परिरक्षक नहीं। कोई मशीन नहीं। बस एक बोतल में पहाड़ों का स्वाद।',
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
            <img src="/product_images/pisyu_loon/pisyu_loon.webp" alt="Authentic stone-ground Himalayan Pisyu Loon salt" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>

        {/* Section 1 */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '50px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <img src="/product_images/pisyu_loon/pisyu_loon2.webp" alt="Traditional stone grinding process of Pisyu Loon" style={{ width: '100%', borderRadius: '30px' }} />
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
          <Link href="https://www.simdi.in/products/pahadi-rock-salt" style={{ background: '#B58E58', color: '#fff', padding: '20px 50px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '12px', letterSpacing: '0.1em' }}>
            <ShoppingCart size={22} /> {t.ctaBtn}
          </Link>
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px', color: '#A3B3A3', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Heart size={14} fill="#B58E58" color="#B58E58" /> Hand-Crafted</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14} fill="#B58E58" color="#B58E58" /> Sil-Batta Ground</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Leaf size={14} fill="#B58E58" color="#B58E58" /> No Additives</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
