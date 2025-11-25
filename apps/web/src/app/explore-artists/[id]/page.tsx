"use client";

import { Instagram, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet } from "@/lib/api-client";

type ArtistProfile = {
  userId: string;
  stageName: string | null;
  city: string | null;
  bio: string | null;
  genres: string[];
  instagram: string | null;
  contactEmail: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  image: string | null;
  name: string;
};

type MusicRow = {
  id: string;
  title: string;
  coverUrl: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  otherUrl: string | null;
  createdAt: string;
};

type GalleryRow = {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
};

type ArtistDetailResponse = {
  profile: ArtistProfile;
  music: MusicRow[];
  gallery: GalleryRow[];
};

const InfoItem = ({
  Icon,
  text,
}: {
  Icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-3">
    <Icon className="h-5 w-5 text-gray-500" />
    <p className="text-base text-gray-500">{text}</p>
  </div>
);

const SpotifyIcon = () => (
  <img
    src="/spotify.svg"
    alt="spotify"
    className="h-5 w-5 brightness-75 grayscale"
  />
);

const YoutubeIcon = () => (
  <img
    src="/youtube.svg"
    alt="youtube"
    className="h-5 w-5 brightness-75 grayscale invert"
  />
);

export default function ArtistDetail() {
  const params = useParams<{ id: string }>();
  const artistId = params.id;

  const [data, setData] = useState<ArtistDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) return;

    void (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiGet<ArtistDetailResponse>(`/artists/${artistId}`);
        setData(res);
      } catch (e) {
        setError("Gagal mengambil detail artist.");
        setData(null);
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [artistId]);

  const profile = data?.profile;
  const tracks = data?.music ?? [];
  const gallery = data?.gallery ?? [];

  const displayName = profile?.name ?? "Artist";
  const displayCity = profile?.city ?? "-";
  const displayGenres = profile?.genres ?? [];

  const socialItems = useMemo(() => {
    if (!profile) return [];
    return [
      { Icon: MapPin, text: displayCity },
      {
        Icon: SpotifyIcon,
        text: profile.spotifyUrl ? "Spotify" : "-",
        href: profile.spotifyUrl ?? undefined,
      },
      {
        Icon: Instagram,
        text: profile.instagram ?? "-",
        href: profile.instagram
          ? `https://instagram.com/${profile.instagram.replace(/^@/, "")}`
          : undefined,
      },
      {
        Icon: YoutubeIcon,
        text: profile.youtubeUrl ? "YouTube" : (profile.contactEmail ?? "-"),
        href: profile.youtubeUrl ?? undefined,
      },
    ];
  }, [profile, displayCity]);

  return (
    <>
      <HeroHeader />
      <main className="flex min-h-screen flex-col pt-20">
        <div className="flex h-fit justify-start bg-neutral-600 px-20">
          {loading ? (
            <Skeleton className="aspect-square w-32 translate-y-1/2 rounded-full bg-neutral-800" />
          ) : (
            <div className="aspect-square w-32 translate-y-1/2 overflow-hidden rounded-full bg-neutral-800">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Header info */}
        <section className="grid gap-10 px-20 py-24 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            {loading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
                {displayName}
              </h1>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <Skeleton className="h-6 w-24 rounded-full" />
              ) : displayGenres.length > 0 ? (
                displayGenres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-gradient-agent bg-card px-2 py-0.5 font-medium text-md"
                  >
                    <span className="bg-gradient-agent bg-clip-text text-transparent">
                      {g}
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No genres</span>
              )}
            </div>

            {/* Social / meta */}
            <div className="border-t pt-4">
              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-40" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {socialItems.map((item, idx) =>
                    item.href ? (
                      <Link
                        key={idx}
                        href={item.href as any}
                        target="_blank"
                        className="contents"
                      >
                        <InfoItem Icon={item.Icon} text={item.text} />
                      </Link>
                    ) : (
                      <InfoItem key={idx} Icon={item.Icon} text={item.text} />
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            {!loading && profile?.bio ? (
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            ) : null}

            {error ? <p className="text-red-400">{error}</p> : null}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-end gap-2">
            <Button variant="agent" size="lg" disabled={loading || !!error}>
              Book Now
            </Button>
            <Button
              variant="agentOutline"
              size="lg"
              disabled={loading || !!error}
            >
              Contact
            </Button>
          </div>
        </section>

        {/* Music + Gallery */}
        <section className="w-full px-20">
          {/* My Music */}
          <div className="flex flex-col gap-6">
            <h4 className="text-h5">My Music</h4>

            {loading ? (
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 w-40 rounded-xl" />
                ))}
              </div>
            ) : tracks.length === 0 ? (
              <p className="text-gray-500">Belum ada musik.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex w-max flex-row space-x-4">
                  {tracks.map((t) => (
                    <div
                      key={t.id}
                      className="flex shrink-0 flex-col items-start gap-1"
                    >
                      <Card className="relative h-40 w-40 overflow-hidden rounded-xl bg-gray-200">
                        {t.coverUrl ? (
                          <img
                            src={t.coverUrl}
                            alt={t.title}
                            className="relative h-full w-full object-cover"
                          />
                        ) : null}
                      </Card>

                      <h5 className="text-bodyLarge">{t.title}</h5>

                      <div className="flex gap-2">
                        {t.spotifyUrl ? (
                          <Link
                            href={t.spotifyUrl as any}
                            target="_blank"
                            className="contents"
                          >
                            <img
                              src="/spotify.svg"
                              alt="spotify"
                              className="h-4 w-auto"
                            />
                          </Link>
                        ) : null}
                        {t.youtubeUrl ? (
                          <Link
                            href={t.youtubeUrl as any}
                            target="_blank"
                            className="contents"
                          >
                            <img
                              src="/youtube.svg"
                              alt="youtube"
                              className="h-4 w-auto"
                            />
                          </Link>
                        ) : null}
                        {t.otherUrl ? (
                          <Link
                            href={t.otherUrl as any}
                            target="_blank"
                            className="text-gray-400 text-xs underline"
                          >
                            other
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* My Gallery */}
          <div className="my-14 flex w-full flex-col gap-6">
            <div className="flex items-center gap-4">
              <h4 className="text-h5">My Gallery</h4>
            </div>

            {loading ? (
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-52 w-[300px] rounded-xl" />
                ))}
              </div>
            ) : gallery.length === 0 ? (
              <p className="text-gray-500">Belum ada foto di gallery.</p>
            ) : (
              <div className="h-52 overflow-x-scroll">
                <div className="flex h-full w-max flex-row space-x-4">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="aspect-video h-full min-w-[300px] shrink-0 overflow-hidden rounded-xl bg-gray-200"
                      title={g.caption ?? undefined}
                    >
                      <img
                        src={g.imageUrl}
                        alt={g.caption ?? "gallery"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
