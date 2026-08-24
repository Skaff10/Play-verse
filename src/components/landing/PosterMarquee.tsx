'use client';

/**
 * AUI-style auto-scrolling poster marquee.
 * Replaces AUI's client logo ticker with movie/show/game poster thumbnails.
 */

const POSTER_ITEMS = [
  { title: 'Interstellar', url: 'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { title: 'Breaking Bad', url: 'https://image.tmdb.org/t/p/w300/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { title: 'The Witcher 3', url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg' },
  { title: 'The Last of Us', url: 'https://image.tmdb.org/t/p/w300/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg' },
  { title: 'God of War', url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg' },
  { title: 'Fight Club', url: 'https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
  { title: 'Stranger Things', url: 'https://image.tmdb.org/t/p/w300/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
  { title: 'Red Dead Redemption 2', url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg' },
  { title: 'Inception', url: 'https://image.tmdb.org/t/p/w300/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
  { title: 'Arcane', url: 'https://image.tmdb.org/t/p/w300/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg' },
  { title: 'Elden Ring', url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg' },
  { title: 'The Dark Knight', url: 'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911BCKU2RMNH7GU.jpg' },
];

export default function PosterMarquee() {
  // Duplicate items for seamless loop
  const items = [...POSTER_ITEMS, ...POSTER_ITEMS];

  return (
    <section className="relative mx-auto max-w-[1280px] overflow-hidden text-center">
      <p className="text-aui-eyebrow mb-6 inline-flex gap-2 px-4 md:mb-12 md:px-0">
        From blockbusters to indie gems — track them all
      </p>

      <div className="relative">
        {/* Edge fade gradients */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-space to-transparent md:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-space to-transparent md:w-32" />

        {/* Marquee track */}
        <div className="overflow-hidden">
          <div className="marquee-track">
            {items.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                className="shrink-0"
              >
                <div className="h-[140px] w-[100px] overflow-hidden rounded-lg border border-stroke-dark bg-eerie transition-transform duration-300 hover:scale-105 md:h-[180px] md:w-[128px]">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-full w-full object-cover opacity-80 transition-opacity duration-200 hover:opacity-100"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
