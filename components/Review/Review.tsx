import { Star } from "lucide-react"

interface ReviewCard {
  initials: string
  name: string
  city: string
  rating: number
  quote: string
  profilePhotoUrl?: string
  isProducer?: boolean
}
const GOOGLE_LISTING_URL = "https://share.google/5Gd8gm1sIB8oi6CdO"


const placeholderReviews: ReviewCard[] = [
  {
    initials: "RK",
    name: "Rahul Khanna",
    city: "Delhi",
    rating: 5,
    quote: "The Bilona ghee took me back to my grandmother's kitchen. Absolutely authentic taste that you just can't find in city stores!",
  },
  {
    initials: "PM",
    name: "Priya Menon",
    city: "Mumbai",
    rating: 5,
    quote: "Best honey I've ever had. You can taste the wildflowers! My kids now refuse to eat any other honey. Worth every rupee.",
  },
  {
    initials: "KD",
    name: "Kamla Devi",
    city: "Chakisain Village, Uttarakhand",
    rating: 5,
    quote: "SIMDI gave us hope. Now I earn for my family while keeping our traditions alive. My grandmother's recipes reach homes across India.",
    isProducer: true,
  },
]

interface PlaceReview {
  author_name: string
  rating: number
  text: string
  profile_photo_url?: string
  relative_time_description?: string
}

interface PlaceDetailsResponse {
  result?: {
    name?: string
    rating?: number
    reviews?: PlaceReview[]
  }
  status: string
  error_message?: string
}

interface GoogleReviewData {
  placeName: string | null
  averageRating: number | null
  reviews: ReviewCard[] | null
}

async function fetchGooglePlaceReviews(): Promise<GoogleReviewData | null> {
  const apiKey = process.env.GOOGLE_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) return null

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,reviews,name&key=${encodeURIComponent(apiKey)}`

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } })
    if (!response.ok) return null

    const data = (await response.json()) as PlaceDetailsResponse
    if (data.status !== "OK" || !data.result) return null

    const reviews = data.result.reviews?.slice(0, 3).map((review) => {
      const initials = review.author_name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

      return {
        initials,
        name: review.author_name,
        city: review.relative_time_description || "Verified customer",
        rating: review.rating,
        quote: review.text,
        profilePhotoUrl: review.profile_photo_url,
      }
    })

    return {
      placeName: data.result.name ?? null,
      averageRating: data.result.rating ?? null,
      reviews: reviews?.length ? reviews : null,
    }
  } catch {
    return null
  }
}

export async function ReviewsSection() {
  const googleData = await fetchGooglePlaceReviews()
  const reviews = googleData?.reviews ?? placeholderReviews

  return (
    <section style={{ padding: '80px 20px', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Label */}
        <p style={{
          color: '#B58E58',
          letterSpacing: '0.2em',
          fontSize: '0.75rem',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          Customer Stories
        </p>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2.2rem',
          color: '#1E2D24',
          textAlign: 'center',
          marginBottom: '8px',
          fontWeight: 'normal',
        }}>
          {googleData?.placeName ? `${googleData.placeName} Reviews` : 'Voices from Our Community'}
        </h2>

        {/* Average rating line */}
        {googleData?.averageRating && (
          <p style={{
            textAlign: 'center',
            color: '#5E6E5E',
            fontSize: '0.9rem',
            marginBottom: '50px',
          }}>
            Rated {googleData.averageRating.toFixed(1)} / 5.0 on Google Reviews
          </p>
        )}

        {!googleData?.averageRating && (
          <div style={{ marginBottom: '50px' }} />
        )}

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
        }}>
          {reviews.map((review, index) => (
            <div
              key={index}
              style={{
                padding: '32px 24px',
                border: review.isProducer ? 'none' : '1px solid #eee',
                borderRadius: '12px',
                background: review.isProducer ? '#1E2D24' : '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    style={{ width: '16px', height: '16px', fill: '#B58E58', color: '#B58E58' }}
                  />
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                color: review.isProducer ? '#D4C5A9' : '#3A4A3A',
                margin: 0,
                flexGrow: 1,
              }}>
                &ldquo;{review.quote}&rdquo;
              </p>

              {/* Divider */}
              <div style={{
                borderTop: `1px solid ${review.isProducer ? 'rgba(255,255,255,0.12)' : '#eee'}`,
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                {/* Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: review.isProducer ? '#B58E58' : '#E8F0E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {review.profilePhotoUrl ? (
                    <img
                      src={review.profilePhotoUrl}
                      alt={review.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{
                      fontFamily: 'Georgia, serif',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      color: review.isProducer ? '#1E2D24' : '#5E6E5E',
                    }}>
                      {review.initials}
                    </span>
                  )}
                </div>

                {/* Name & location */}
                <div>
                  <p style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    color: review.isProducer ? '#fff' : '#1E2D24',
                  }}>
                    {review.name}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    color: review.isProducer ? '#B58E58' : '#5E6E5E',
                  }}>
                    {review.isProducer ? 'Village Producer' : review.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '48px',
    flexWrap: 'wrap',
  }}
>
  <a
    href={GOOGLE_LISTING_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="cta-outline"
  >
    View All Reviews
  </a>

  <a
    href={GOOGLE_LISTING_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="cta-filled"
  >
    <Star className="cta-icon" />
    Rate Us on Google
  </a>
</div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "SIMDI",
              "sameAs": [GOOGLE_LISTING_URL],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": googleData?.averageRating ?? 5,
                "reviewCount": reviews.length,
                "bestRating": 5,
                "worstRating": 1,
              },
            }),
          }}
        />
      </div>
    </section>
  )
}