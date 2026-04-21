import Image from "next/image";
import { StarRating } from "./star-rating";

export interface Testimonial {
  name: string;
  /** Profession/niche, e.g. "Dentista MEI" */
  role: string;
  /** City/State, e.g. "São Paulo/SP" */
  location?: string;
  text: string;
  /** Avatar URL. If absent, initials circle fallback is rendered. */
  avatar?: string | null;
  /** 0-5, fractional allowed */
  rating?: number;
  /** Optional video URL for 15s video testimonial. */
  video?: string | null;
  /** Poster image for the video (shown before play). */
  videoPoster?: string | null;
}

/**
 * Editorial testimonial card.
 * - Photo avatar + full metadata (name, role/niche, city)
 * - Inline rating
 * - Optional video slot: poster + play overlay (actual video handling
 *   should be wired by the consumer via <video controls>).
 */
export function TestimonialCard({
  name,
  role,
  location,
  text,
  avatar,
  rating = 5,
  video,
  videoPoster,
  /** Backwards-compat: old sites passed `text` only with string role. */
}: Testimonial) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const hasVideo = Boolean(video);

  return (
    <figure className="h-full flex flex-col bg-cream-2 border border-navy/10 p-7 transition-colors hover:border-navy/40">
      {/* Rating + quote mark */}
      <div className="flex items-start justify-between gap-4">
        <StarRating value={rating} />
        <svg className="w-8 h-8 text-electric-blue/30 flex-none" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 21v-7.4c0-5.7 3.7-9.6 9-10.6l1 2.1c-2.4.9-4 3.6-4 5.9h4v10h-10zm-14 0v-7.4c0-5.7 3.7-9.6 9-10.6l1 2.1c-2.4.9-4 3.6-4 5.9h4v10H0z" />
        </svg>
      </div>

      {/* Optional video slot */}
      {hasVideo && (
        <div className="mt-5 relative aspect-video bg-navy/10 overflow-hidden group">
          {videoPoster && (
            <Image
              src={videoPoster}
              alt={`Depoimento em vídeo de ${name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          <a
            href={video!}
            className="absolute inset-0 flex items-center justify-center bg-navy/30 hover:bg-navy/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue"
            aria-label={`Assistir depoimento de ${name}`}
          >
            <span className="w-14 h-14 rounded-full bg-electric-blue grid place-items-center text-white transition-transform group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </a>
        </div>
      )}

      <blockquote
        className="mt-5 font-serif italic text-navy leading-[1.35] flex-1"
        style={{ fontSize: "clamp(18px, 1.5vw, 22px)", letterSpacing: "-0.01em" }}
      >
        “{text}”
      </blockquote>

      <figcaption className="mt-6 pt-6 border-t border-navy/15 flex items-center gap-4">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="rounded-full object-cover flex-none"
          />
        ) : (
          <span
            aria-hidden="true"
            className="w-12 h-12 rounded-full bg-navy text-cream grid place-items-center font-medium text-sm flex-none"
          >
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <div className="font-medium text-sm text-navy truncate">{name}</div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted truncate">
            {role}
            {location && <> · {location}</>}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
