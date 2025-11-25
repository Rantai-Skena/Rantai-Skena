"use client";

import { Clock, Instagram, Mail, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet, apiPost } from "@/lib/api-client";

type ServerEvent = {
  id: string;
  agentId: string;
  name: string;
  location: string;
  startsAt: string; // ISO
  endsAt: string | null;
  genres: string[] | null;
  description: string | null;
  isPublished: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type UiEvent = {
  id: string;
  agentId: string;
  name: string;
  location: string;
  startsAt: Date;
  endsAt: Date | null;
  genres: string[];
  description?: string | null;
  imageUrl: string | null;
};

interface ApplicationResponse {
  id: string;
  eventId: string;
  artistId: string;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  toastMessage: string;
}

interface ApplicationRequest {
  eventId: string;
  message: string;
}

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

export default function EventDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params?.id;

  const [event, setEvent] = useState<UiEvent | null>(null);
  const [moreEvents, setMoreEvents] = useState<UiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Fetch event detail
        const eventData = await apiGet<ServerEvent>(`/events/${eventId}`);
        const mappedEvent: UiEvent = {
          id: eventData.id,
          agentId: eventData.agentId,
          name: eventData.name,
          location: eventData.location,
          startsAt: new Date(eventData.startsAt),
          endsAt: eventData.endsAt ? new Date(eventData.endsAt) : null,
          genres: eventData.genres ?? [],
          description: eventData.description,
          imageUrl: eventData.imageUrl,
        };
        setEvent(mappedEvent);

        // Fetch more events by same agent
        const eventsList = await apiGet<ServerEvent[]>("/events");
        const filteredMoreEvents = eventsList
          .filter(
            (e) => e.agentId === eventData.agentId && e.id !== eventData.id,
          )
          .map((e) => ({
            id: e.id,
            agentId: e.agentId,
            name: e.name,
            location: e.location,
            startsAt: new Date(e.startsAt),
            endsAt: e.endsAt ? new Date(e.endsAt) : null,
            genres: e.genres ?? [],
            description: e.description,
            imageUrl: e.imageUrl,
          }))
          .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
          .slice(0, 8);

        setMoreEvents(filteredMoreEvents);
      } catch (error) {
        console.error("Failed to fetch event data:", error);
        toast.error("Event tidak ditemukan atau gagal dimuat");
      } finally {
        setLoading(false);
      }
    };

    void fetchEventData();
  }, [eventId]);

  const dateLabel = useMemo(() => {
    if (!event) return "";
    return event.startsAt.toLocaleDateString("id-ID", { dateStyle: "medium" });
  }, [event]);

  const timeLabel = useMemo(() => {
    if (!event) return "";
    const startTime = event.startsAt.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = event.endsAt
      ? event.endsAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;
    return endTime ? `${startTime} WIB - ${endTime} WIB` : `${startTime} WIB`;
  }, [event]);

  const handleApply = async (): Promise<void> => {
    if (!event) return;

    try {
      const applicationData = await apiPost<
        ApplicationResponse,
        ApplicationRequest
      >("/applications", {
        eventId: event.id,
        message: "",
      });

      if (
        applicationData.toastMessage === "Kamu sudah pernah apply ke event ini!"
      ) {
        toast.info(applicationData.toastMessage);
      } else {
        toast.success(applicationData.toastMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal apply. Pastikan kamu login sebagai artist.";

      toast.error(errorMessage);
    }
  };

  return (
    <>
      <HeroHeader />
      <main className="mx-auto min-h-screen max-w-7xl p-8 md:p-12 lg:p-20">
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Cover / Banner */}
          {loading ? (
            <Skeleton className="aspect-video rounded-xl lg:aspect-5/4" />
          ) : event?.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="aspect-video rounded-xl object-cover lg:aspect-5/4"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl lg:aspect-5/4">
              <span className="text-gray-500">No image available</span>
            </div>
          )}

          {/* Detail */}
          <div className="flex flex-col gap-6">
            {loading || !event ? (
              <>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-24 w-full" />
              </>
            ) : (
              <>
                <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
                  {event.name}
                </h1>

                {/* Agent name belum ada endpoint public, jadi tampilkan id dulu */}
                <h2 className="font-medium text-xl text-zinc-200">
                  Agent {event.agentId.slice(0, 6)}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {event.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-gradient-artist bg-card px-2 py-0.5 font-medium text-xs"
                    >
                      <span className="bg-gradient-artist bg-clip-text text-transparent">
                        {genre}
                      </span>
                    </span>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoItem Icon={MapPin} text={event.location} />
                    <InfoItem Icon={Clock} text={timeLabel} />
                    <InfoItem Icon={Instagram} text="-" />
                    <InfoItem Icon={Mail} text="-" />
                  </div>
                </div>

                {event.description ? (
                  <p className="text-zinc-300 leading-relaxed">
                    {event.description}
                  </p>
                ) : null}

                <div className="space-x-4">
                  <Button variant="artist" onClick={handleApply}>
                    Apply
                  </Button>
                  {/* <Button
                    variant="artistOutline"
                    onClick={() => router.push("/chatbot")}
                  >
                    Contact
                  </Button> */}
                </div>

                <p className="text-sm text-zinc-500">{dateLabel}</p>
              </>
            )}
          </div>
        </section>

        <hr className="my-10" />

        {/* More events */}
        <section className="flex flex-col gap-8">
          <h2 className="font-bold text-h4">More events by this agent</h2>

          {loading ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="w-full min-w-[300px] max-w-xs shrink-0 rounded-2xl border bg-card p-4 sm:p-5"
                >
                  <Skeleton className="mb-4 aspect-video w-full rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                  <Skeleton className="mt-2 h-4 w-1/3" />
                  <Skeleton className="mt-5 h-9 w-full" />
                </Card>
              ))}
            </div>
          ) : moreEvents.length === 0 ? (
            <div className="text-zinc-500">
              Belum ada event lain dari agent ini.
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {moreEvents.map((moreEvent) => {
                const eventDate = moreEvent.startsAt.toLocaleDateString(
                  "id-ID",
                  {
                    dateStyle: "medium",
                  },
                );
                const eventTime = moreEvent.startsAt.toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );

                return (
                  <div
                    key={moreEvent.id}
                    className="w-full min-w-[300px] max-w-xs shrink-0 rounded-2xl border bg-card p-4 shadow-xl transition-all duration-300 hover:border-sky-500 hover:shadow-[0_0_25px_rgba(31,154,255,0.35)] sm:p-5"
                  >
                    {moreEvent.imageUrl ? (
                      <img
                        src={moreEvent.imageUrl}
                        alt={moreEvent.name}
                        className="mb-4 aspect-video w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-xl bg-zinc-300">
                        <span className="text-sm text-zinc-600">No image</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <div className="inline-flex gap-1.5 self-start rounded-full">
                        {moreEvent.genres.map((genre) => (
                          <span
                            key={genre}
                            className="rounded-full border border-gradient-artist bg-card px-2 py-0.5 font-medium text-xs"
                          >
                            <span className="bg-gradient-artist bg-clip-text text-transparent">
                              {genre}
                            </span>
                          </span>
                        ))}
                      </div>

                      <h2 className="mt-1 font-bold text-white text-xl leading-tight">
                        {moreEvent.name}
                      </h2>
                      <p className="font-normal text-sm text-zinc-400">
                        {moreEvent.location} &bull; {eventDate}
                      </p>
                      <p className="font-normal text-sm text-zinc-400">
                        {eventTime} WIB
                      </p>
                    </div>

                    <div className="mt-5 w-full">
                      <Button
                        variant="artist"
                        className="w-full"
                        onClick={() =>
                          router.push(`/explore-gigs/${moreEvent.id}`)
                        }
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
