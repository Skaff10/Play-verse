/**
 * AUI-style status showcase section.
 * Shows example media cards in different tracking statuses,
 * matching AUI's careers/job cards grid pattern with tag badges.
 */

const STATUS_CARDS = [
  {
    status: "WATCHING",
    type: "SERIES",
    title: "Stranger Things",
    subtitle: "Season 4 • Episode 7",
    coverUrl: "https://image.tmdb.org/t/p/w300/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    progress: "7 / 9 episodes",
  },
  {
    status: "PLAYING",
    type: "GAME",
    title: "Elden Ring",
    subtitle: "87 hours played",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    progress: "62% complete",
  },
  {
    status: "COMPLETED",
    type: "MOVIE",
    title: "Interstellar",
    subtitle: "Christopher Nolan • 2014",
    coverUrl: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    progress: "9.2 / 10",
  },
  {
    status: "BACKLOG",
    type: "SERIES",
    title: "Arcane",
    subtitle: "Netflix • 2 Seasons",
    coverUrl: "https://image.tmdb.org/t/p/w300/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    progress: "Added 3 days ago",
  },
  {
    status: "COMPLETED",
    type: "GAME",
    title: "God of War Ragnarök",
    subtitle: "Santa Monica Studio",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg",
    progress: "8.8 / 10",
  },
  {
    status: "WATCHING",
    type: "MOVIE",
    title: "Dune: Part Two",
    subtitle: "Denis Villeneuve • 2024",
    coverUrl:
      "https://image.tmdb.org/t/p/original/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    progress: "In progress",
  },
];

const statusColors: Record<string, string> = {
  WATCHING: "border-fire/50 bg-fire/10 text-fire",
  PLAYING: "border-[#4ECDC4]/50 bg-[#4ECDC4]/10 text-[#4ECDC4]",
  COMPLETED: "border-[#6BCB77]/50 bg-[#6BCB77]/10 text-[#6BCB77]",
  BACKLOG: "border-mist/20 bg-mist/5 text-mist/60",
};

export default function StatusShowcase() {
  return (
    <div className="mx-auto w-full max-w-[1192px] px-5 md:px-0">
      <div className="mx-auto w-full max-w-[518px] text-center">
        <h2 className="text-aui-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-mist">
          <span className="opacity-50">organize your</span> entire media life
        </h2>
        <p className="text-aui-content mt-4">
          Watching, playing, completed, or backlogged — every title gets a home.
          Every status tells a story.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 xl:gap-6">
        {STATUS_CARDS.map((card) => (
          <div
            key={card.title}
            className="group relative flex min-h-[220px] flex-col justify-between gap-y-8 overflow-hidden rounded-lg border border-stroke-dark bg-space px-4 py-6 transition-colors duration-300 hover:border-mist/20 xl:p-6"
          >
            {/* Tags */}
            <div className="relative flex w-full justify-between gap-5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`badge-aui !text-[11px] !py-1.5 !px-2.5 !border ${statusColors[card.status]}`}
                >
                  {card.status}
                </span>
                <span className="badge-aui !text-[11px] !py-1.5 !px-2.5">
                  {card.type}
                </span>
              </div>

              {/* Arrow icon on hover */}
              <div className="scale-0 transition-transform duration-300 group-hover:scale-100">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect width="26" height="26" rx="4" fill="#F1F0E0" />
                  <path
                    d="M8 8.5L17 8.5V17.5"
                    stroke="#121212"
                    strokeWidth="1.4"
                  />
                  <path d="M17 8.5L8 17.5" stroke="#121212" strokeWidth="1.4" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex items-end gap-4">
              {/* Poster thumbnail */}
              <div className="h-[80px] w-[56px] shrink-0 overflow-hidden rounded-sm bg-eerie">
                <img
                  src={card.coverUrl}
                  alt={card.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1">
                <div className="text-xl font-bold leading-tight tracking-[-0.03em] text-mist">
                  {card.title}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-mist/50">
                  {card.subtitle}
                </div>
                <div className="mt-2 text-xs font-semibold text-fire">
                  {card.progress}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
